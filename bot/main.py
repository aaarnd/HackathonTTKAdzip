import telebot
from telebot.types import Message, CallbackQuery, ReplyKeyboardRemove

from pydub import AudioSegment
import pyaudio
import logging
import sqlite3
import json
import re
import time
import os
from vosk import Model, KaldiRecognizer
from time import sleep

from text import *
from keyboard import *
from smtp import generate_auth_code, send_email
from config import settings


DATABASE = 'database.db3'
model = Model("vosk-model-small-ru-0.22")
rec = KaldiRecognizer(model, 16000)
p = pyaudio.PyAudio()



def setup_database():
    conn = sqlite3.connect('database.db3')
    cursor = conn.cursor()

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS tariffs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS options (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS contracts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        contract TEXT UNIQUE NOT NULL,
        userdata TEXT,
        phonenumber TEXT UNIQUE NOT NULL,
        tariff INTEGER,
        options TEXT,
        FOREIGN KEY (tariff) REFERENCES tariffs(id)
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS user_history(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userid UNIQUE,
        contract TEXT
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS code_check (
        userid TEXT,
        code TEXT
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        personal_info TEXT,
        role TEXT CHECK(role IN ('admin', 'editor')) NOT NULL
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS intents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        intent_name TEXT NOT NULL,
        keywords TEXT NOT NULL,  
        response_text TEXT NOT NULL,
        email TEXT
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        subjects TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS tariffs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL
    )
    ''')

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS contract_requests (
        id      INTEGER PRIMARY KEY AUTOINCREMENT,
        phone           UNIQUE,
        address         UNIQUE
    )
    """)

    tariffs_data = [
        ('Честный', 'Тариф честный имеет скорость 10 Мбит\сек и абонентскую плату в 100 рублей в месяц.', 100),
        ('Мощный', 'Тариф мощный имеет скорость 100 Мбит\сек и абонентскую плату в 400 рублей в месяц.', 400),
        ('Максимальный', 'Тариф максимальный имеет скорость 1 Гбит\сек и абонентскую плату в 800 рублей в месяц', 800)
    ]
    cursor.executemany('INSERT OR IGNORE INTO tariffs (name, description, price) VALUES (?, ?, ?)', tariffs_data)

    options_data = [
        ('Безлимитный интернет', 'Доступ к безлимитному интернету', 100),
        ('Выделенный IP', 'Доступ к выделенному IP', 100),
        ('Персональный менеджер', 'Доступ к персональному менеджеру', 100),
        ('Фирменный роутер', 'Доступ к роутеру', 100)
    ]
    cursor.executemany('INSERT OR IGNORE INTO options (name, description, price) VALUES (?, ?, ?)', options_data)

    contracts_data = [
        ('516000001', 'Алексей Иванов', 'dB6jVnJE', '89270000001', 1, None, 'mail@mail.ru'),
        ('516000002', 'Мария Смирнова', 'GbQnu9qd', '89270000002', 2, None, 'mail@mail.ru'),
        ('516000003', 'Олег Сидоров', 'Vub6pkDs', '89270000003', 3, None, 'mail@mail.ru'),
        ('516000004', 'Екатерина Федорова', 'e27rdX1D',  '89270000004', 1, None, 'mail@mail.ru'),
        ('516000005', 'Дмитрий Николаев', 'evlXZVmH', '89270000005', 2, None, 'mail@mail.ru'),
        ('516000006', 'Ирина Александрова', 'xx4ubxS0', '89270000006', 3, None, 'mail@mail.ru'),
        ('516000007', 'Сергей Михайлов', 'dqJnZi3s', '89270000007', 1, None, 'mail@mail.ru'),
        ('516000008', 'Анна Петрова',  'ih6zhgtr', '89270000008', 2, None, 'mail@mail.ru'),
        ('516000009', 'Максим Кузнецов',  '6KFSGNco', '89270000009', 3, None, 'mail@mail.ru')
    ]
    cursor.executemany('INSERT OR IGNORE INTO contracts (contract, userdata, password, phonenumber, tariff, options, email) VALUES (?, ?, ?, ?, ?, ?, ?)', contracts_data)

    conn.commit()
    conn.close()

setup_database()


logging.basicConfig(level=logging.INFO)
bot = telebot.TeleBot(token=settings.bot_token.get_secret_value())


@bot.message_handler(commands=['start', 'menu'])
def cmd_start(message:Message=None) -> None:
    conn = sqlite3.connect('database.db3')
    cursor = conn.cursor()
    cursor.execute('INSERT OR IGNORE INTO user_history (userid) VALUES (?)', (message.from_user.id, ))
    cursor.execute('SELECT contract FROM user_history WHERE userid = ?', (message.from_user.id, ))
    result = cursor.fetchone()

    conn.commit()
    conn.close()
    if result[0] is not None:
        bot.send_message(chat_id=message.chat.id, text=f"{message.from_user.first_name}, {menu_text}", reply_markup=menu_markup)
    else:
        bot.send_message(chat_id=message.chat.id, text=start_text, reply_markup=start_markup)


@bot.message_handler(commands=['answer'])
def answer_to_user(message: Message):
    if str(message.chat.id)==tariffs_and_options_chat_support:
        splitted_message=message.text.split(" ")
        answer_to=splitted_message[1]
        message_to_send=splitted_message[2:len(splitted_message)]
        bot.send_message(answer_to, text=f"Оператор поддержки по тарифам и услугам ответил на Вашу заявку:\n{' '.join(message_to_send)}")
    elif str(message.chat.id)==contract_chat_support:
        splitted_message=message.text.split(" ")
        answer_to=splitted_message[1]
        message_to_send=splitted_message[2:len(splitted_message)]
        bot.send_message(answer_to, text=f"Оператор поддержки по заключению договоров ответил на Вашу заявку:\n{' '.join(message_to_send)}")
    else:
        pass


@bot.message_handler(content_types=['text'])
def get_text_messages(message: Message):
    if 'тарифы' in message.text.lower():
        get_tariffs(message)
    elif 'сменить' in message.text.lower():
        change_options(message)
    elif 'услуги' in message.text.lower():
        get_options(message)
    elif 'личный' in message.text.lower():
        get_contract(message)
    elif 'обратиться' in message.text.lower():
        get_help(message)
    elif 'выйти' in message.text.lower():
        logout(message)
    elif 'поменять тариф' in message.text.lower():
        change_tariff(message)
    elif 'назад' in message.text.lower():
        cmd_start(message)


@bot.callback_query_handler(func=lambda call:True)
def callback_query(call: CallbackQuery):
    req = call.data.split('_')
    if req[0] == 'have':
        bot.clear_step_handler_by_chat_id(chat_id=call.message.chat.id)
        check_contract(call)
    elif req[0] == 'doesnt':
        bot.clear_step_handler_by_chat_id(chat_id=call.message.chat.id)
        create_contract(call)
    elif req[0] == 'back':
        bot.clear_step_handler_by_chat_id(chat_id=call.message.chat.id)
        cmd_start(call.message)
    elif req[0] == 'reset':
        bot.clear_step_handler_by_chat_id(chat_id=call.message.chat.id)
        email_recovery(call, req[1])
    bot.answer_callback_query(call.id)


@bot.message_handler(content_types=['voice'])
def handle_voice(message):
    file_info = bot.get_file(message.voice.file_id)
    file_data = bot.download_file(file_info.file_path)
    file_path = "voice_message.ogg"

    with open(file_path, "wb") as f:
        f.write(file_data)

    
    try:
        audio = AudioSegment.from_ogg(file_path)
        
        audio = audio.set_channels(1)
        audio = audio.set_frame_rate(16000)



        wav_path = "voice_message.wav"
        audio.export(wav_path, format="wav", codec="pcm_s16le")


        with open(wav_path, 'rb') as f:
            rec.AcceptWaveform(f.read())
            result = rec.Result()

        
        text = json.loads(result)["text"]
        

    except Exception as e:
        print(f"Ошибка в обработке аудиофайла: {e}")
        return

    
    try:
        os.remove(file_path)
        os.remove(wav_path)
    except PermissionError as e:
        print(f"Ошибка в удалении файла: {e}")


def check_contract(call: CallbackQuery):
    message = bot.send_message(chat_id=call.message.chat.id, text=ident_text)
    bot.register_next_step_handler(message, check_user)


def check_user(message: Message):
    contract = message.text
    conn = sqlite3.connect('database.db3')
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM contracts WHERE contract = ?", (contract,))
    result = cursor.fetchone()
    conn.close()

    if result:
        message = bot.send_message(chat_id=message.chat.id, text=send_password_text, reply_markup=pass_markup_create(contract))
        bot.register_next_step_handler(message, check_password, contract)
    else:
        message = bot.send_message(chat_id=message.chat.id, text=wrong_contract_text, reply_markup=back_markup)
        bot.register_next_step_handler(message, check_user)


def check_password(message: Message, contract):
    password = message.text
    conn = sqlite3.connect('database.db3')
    cursor = conn.cursor()
    cursor.execute('SELECT password FROM contracts WHERE contract = ?', (contract, ))
    result = cursor.fetchone()

    if result[0] == password:
        conn = sqlite3.connect('database.db3')
        cursor = conn.cursor()

        cursor.execute('UPDATE user_history SET contract = ? WHERE userid = ?', (contract, message.from_user.id))
        conn.commit()
        conn.close()

        bot.send_message(chat_id=message.chat.id, text=f"{message.from_user.first_name}, {auth_success_text}", reply_markup=menu_markup)
    else:
        message = bot.send_message(chat_id=message.chat.id, text=wrong_password_text, reply_markup=back_markup)
        bot.register_next_step_handler(message, check_password, contract)


def email_recovery(call: CallbackQuery, contract):
    bot.clear_step_handler_by_chat_id(chat_id=call.message.chat.id)
    conn = sqlite3.connect('database.db3')
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) FROM code_check WHERE userid = ?', (call.from_user.id, ))
    count = cursor.fetchone()[0]

    if count > 3:
        bot.clear_step_handler_by_chat_id(chat_id=call.message.chat.id)
        bot.send_message(chat_id=call.from_user.id, text=too_many_requests_text)
        return cmd_start(call.message)
    elif count > 2:
        message = bot.send_message(chat_id=call.message.chat.id, text=send_email_text)
        return bot.register_next_step_handler(message, confirm_email, contract)

    cursor.execute('SELECT email FROM contracts WHERE contract = ?', (contract, ))
    result = cursor.fetchone()[0]
    code = generate_auth_code()
    send_email(result, code)

    cursor.execute('INSERT INTO code_check (userid, code) VALUES (?, ?)', (call.from_user.id, code, ))
    conn.commit()
    conn.close()

    message = bot.send_message(chat_id=call.message.chat.id, text=send_email_text)
    bot.register_next_step_handler(message, confirm_email, contract)

def confirm_email(message: Message, contract):
    bot.clear_step_handler_by_chat_id(chat_id=message.chat.id)
    conn = sqlite3.connect('database.db3')
    cursor = conn.cursor()

    cursor.execute("""
        SELECT code FROM code_check
        WHERE userid = ?
        ORDER BY ROWID DESC
        LIMIT 1
    """, (message.from_user.id, ))

    result = cursor.fetchone()[0]
    if result == message.text:
        cursor.execute('UPDATE user_history SET contract = ? WHERE userid = ?', (contract[0], message.from_user.id))
        conn.commit()
        conn.close()

        bot.send_message(chat_id=message.chat.id, text=f"{message.from_user.first_name}, {auth_success_text}", reply_markup=menu_markup)
    else:
        bot.send_message(chat_id=message.chat.id, text=wrong_auth_code_text,reply_markup=back_markup)
        conn.close()
        bot.register_next_step_handler(message, confirm_email, contract)


def create_contract(call: CallbackQuery):
    message = bot.send_message(chat_id=call.message.chat.id, text=request_number_text, reply_markup=back_markup)
    bot.register_next_step_handler(message, check_number)


def check_number(message: Message):
    number = message.text
    cleaned_number = re.sub(r'\D', '', number)

    conn = sqlite3.connect('database.db3')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM contract_requests')
    spam_filter=cursor.fetchall()
    for element in spam_filter:
        if str(element[1])[1:len(element[1])]==cleaned_number[1:len(cleaned_number)]:
            bot.send_message(chat_id=message.chat.id, text=request_already_exists_text)
            message = bot.send_message(chat_id=message.chat.id, text="Возврат в главное меню...")
            sleep(2)
            return cmd_start(message)
    conn.close()

    if len(cleaned_number) == 11 and (cleaned_number.startswith('7') or cleaned_number.startswith('8')):
        message = bot.send_message(chat_id=message.chat.id, text=request_address_text, reply_markup=back_markup)
        bot.register_next_step_handler(message, write_contract_request, cleaned_number)
    else:
        message = bot.send_message(chat_id=message.chat.id, text=wrong_number_format_text)
        return cmd_start(message)


def write_contract_request(message: Message, number):
    address = message.text
    conn = sqlite3.connect('database.db3')
    cursor = conn.cursor()
    cursor.execute('INSERT OR IGNORE INTO contract_requests (phone, address) VALUES (?, ?)', (number, address, ))
    conn.commit()
    conn.close()

    bot.send_message(chat_id=message.chat.id, text=successful_request_text)
    bot.send_message(
    chat_id=contract_chat_support,
    text=(
        f"Пользователь @{message.from_user.username} оставил заявку на заключение договора."
        f"\nКонтактный номер телефона: {'8' + number[1:] if number.startswith('8') else '+' + number}"
        f"\nАдрес: {address}"

        f"\nАйди для обратной связи:\n{message.from_user.id}"
    )
)
    return cmd_start(message)


def logout(message: Message):
    conn = sqlite3.connect('database.db3')
    cursor = conn.cursor()
    cursor.execute('UPDATE user_history SET contract = NULL WHERE userid = ?', (message.from_user.id, ))
    conn.commit()
    conn.close()
    
    bot.send_message(chat_id=message.chat.id, text=successful_logout_text, reply_markup=ReplyKeyboardRemove())
    return cmd_start(message)


def get_options(message:Message):
    bot.send_message(chat_id=message.chat.id, text=get_options_reply_text(), reply_markup=options_markup)


def change_options(message: Message):
    bot.send_message(chat_id=message.chat.id, text=change_options_request_text)
    bot.send_message(
    chat_id=tariffs_and_options_chat_support,
    text=(
        f"Пользователь @{message.from_user.username} оставил заявку на смену услуг."
        f"\nАйди для обратной связи:\n{message.from_user.id}"
    )
)
    return cmd_start(message)


def get_tariffs(message:Message):
    bot.send_message(chat_id=message.chat.id, text=get_tariffs_reply_text(), reply_markup=tariffs_markup)


def change_tariff(message: Message):
    bot.send_message(chat_id=message.chat.id, text=f"{message.from_user.first_name}, {change_tariff_request_text}")
    bot.send_message(
    chat_id=tariffs_and_options_chat_support,
    text=(
        f"Пользователь @{message.from_user.username} оставил заявку на смену тарифа."
        f"\nАйди для обратной связи:\n{message.from_user.id}"
    )
)

    return cmd_start(message)


def get_help(message:Message):
    bot.send_message(chat_id=message.chat.id, text=get_help_text)
    bot.send_message(
    chat_id=tariffs_and_options_chat_support,
    text=(
        f"Пользователь @{message.from_user.username} обратился в поддержку."
        f"\nАйди для обратной связи:\n{message.from_user.id}"
    )
)
    return cmd_start(message)


def get_contract(message:Message):
    bot.send_message(chat_id=message.chat.id, text=get_contract_info_text(message), reply_markup=back_reply_markup)


bot.polling(non_stop=True, timeout=30)
