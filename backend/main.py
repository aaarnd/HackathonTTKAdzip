import telebot
from telebot.types import Message, CallbackQuery, ReplyKeyboardRemove

import schedule
import threading
from datetime import datetime, timedelta
from pydub import AudioSegment
import pyaudio
import logging
import sqlite3
import json
import re
import os
from vosk import Model, KaldiRecognizer
from time import sleep

from lemma import lemmatize
from text import *
from keyboard import *
from smtp import generate_auth_code, send_mail, send_application_email
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
    CREATE TABLE IF NOT EXISTS news_send (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT,
        photo TEXT,
        time TEXT
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS contracts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        contract TEXT UNIQUE NOT NULL,
        userdata TEXT,
        password TEXT,
        phonenumber TEXT UNIQUE NOT NULL,
        tariff INTEGER,
        options TEXT,
        email TEXT,
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

    intents_data =[
        ('Смена тарифа', 'тариф, быстрее, смена, увеличить, потеря, скорость', 'На основе вашего голосового сообщения наша служба определила,'
        'что, возможно, вы хотите сменить тариф. Если это так, нажмите кнопку продолжить, в противном случае нажмите кнопку назад.', 'oleggolovko087@gmail.com'),
        ('Добавление/удаление услуг', 'сменить, заменить, убрать, добавить, опция, антивирус', 'На основе вашего голосового сообщения наша служба'
        ' определила, что, возможно, вы хотите добавить\убрать услуги. Если это так, нажмите кнопку продолжить, в противном случае нажмите кнопку назад.', 'oleggolovko087@gmail.com'),
        ('Жалоба', 'плохо, ужасно, медленно, интернет, услуга, тупить, тупой', 'На основе вашего голосового сообщения наша служба определила, что,'
        ' возможно, вы хотите оставить жалобу. Если это так, нажмите кнопку продолжить, в противном случае нажмите кнопку назад.', 'oleggolovko087@gmail.com'),
        ('Поддержка', 'объяснить, сложно, непонять, непонятно, помогать, помощь, вопрос, спросить', 'На основе вашего голосового сообщения наша служба'
        ' определила, что, возможно, вы хотите оставить заявку в поддержку. Если это так, нажмите кнопку продолжить, в противном случае нажмите кнопку назад.', 'oleggolovko087@gmail.com'),
        ('Заключить договор', 'заключить, договор, новый', 'На основе вашего голосового сообщения наша служба определила, что, возможно, вы хотите '
        'заключить договор. Если это так, нажмите кнопку продолжить, в противном случае нажмите кнопку назад.', 'oleggolovko087@gmail.com')
    ]
    cursor.executemany('INSERT OR IGNORE INTO intents (intent_name, keywords, response_text, email) VALUES (?, ?, ?, ?)', intents_data)

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
    elif 'привет' in message.text.lower():
        bot.send_message(chat_id=message.chat.id, text=greetings_text)
        return cmd_start(message)
    elif 'пока' in message.text.lower():
        bot.send_message(chat_id=message.chat.id, text=goodbye_text)
        return cmd_start(message)



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
    elif req[0] == 'continue':
        bot.clear_step_handler_by_chat_id(chat_id=call.message.chat.id)
        handle_intent(call, req[1])
    bot.answer_callback_query(call.id)


@bot.message_handler(content_types=['voice'])
def handle_voice(message: Message):
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
        print(text)
        if text is None:
            return
    except Exception as e:
        print(f"Ошибка в обработке аудиофайла: {e}")
        return

    try:
        os.remove(file_path)
        os.remove(wav_path)
    except PermissionError as e:
        print(f"Ошибка в удалении файла: {e}")

    lemmatize_text = lemmatize(text)
    if 'выйти' in lemmatize_text:
        return logout(message)
    elif 'посмотреть' in lemmatize_text and 'тариф' in lemmatize_text:
        return get_tariffs(message)
    elif 'посмотреть' in lemmatize_text and 'услуга' in lemmatize_text:
        return get_options(message)
    elif 'личный' in lemmatize_text or 'кабинет' in lemmatize_text:
        return get_contract(message)
    elif 'привет' in lemmatize_text:
        bot.send_message(chat_id=message.chat.id, text=greetings_text)
        return cmd_start(message)
    elif 'пока' in lemmatize_text:
        bot.send_message(chat_id=message.chat.id, text=goodbye_text)
        return cmd_start(message)
    elif 'назад' in lemmatize_text:
        return cmd_start(message)


    conn = sqlite3.connect('database.db3')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM intents')
    rows = cursor.fetchall()
    conn.close()

    count = 0
    intent_index = None
    index = 0
    for row in rows:
        temp_count = 0
        for word in lemmatize_text:
            if word in row[2]:
                temp_count +=1
        if temp_count > count:
            count = temp_count
            intent_index = index
        index +=1
    if intent_index:
        intent = rows[intent_index]
        print(intent)
        bot.send_message(chat_id=message.chat.id, text=get_intent_reply_text(intent), reply_markup=handle_intent_markup_create(intent[1]))



def handle_intent(call: CallbackQuery, intent: str):
    conn = sqlite3.connect('database.db3')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM intents WHERE intent_name = ?', (intent, ))
    result = cursor.fetchone()

    if result[1] == "tariffchange":
        # send_application_email(result[3], result[4])
        change_tariff(call.message)
    elif result[1] == 'optionschange':
        # send_application_email(result[3], result[4])
        change_options(call.message)
    elif result[1] == 'complaint':
        # send_application_email(result[3], result[4])
        get_help(call.message)
    elif result[1] == 'help':
        # send_application_email(result[3], result[4])
        get_help(call.message)
    elif result[1] == 'createcontract':
        send_application_email(result[3], result[4])
        create_contract(call.message)




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
    print(1)
    cursor.execute('SELECT email FROM contracts WHERE contract = ?', (contract, ))
    result = cursor.fetchone()[0]
    code = generate_auth_code()
    print(2)
    send_mail(result, code)

    cursor.execute('INSERT INTO code_check (userid, code) VALUES (?, ?)', (call.from_user.id, code, ))
    cursor.execute('UPDATE user_history SET contract = ? WHERE userid = ?', (contract, call.from_user.id))

    conn.commit()
    conn.close()
    print(3)
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
    send_application_email('oleggolovko087@gmail.com', 'Новая заявка')
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
    send_application_email('oleggolovko087@gmail.com', 'Новая заявка')



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
    send_application_email('oleggolovko087@gmail.com', 'Новая заявка')



def get_help(message:Message):
    bot.send_message(chat_id=message.chat.id, text=get_help_text)
    bot.send_message(
    chat_id=tariffs_and_options_chat_support,
    text=(
        f"Пользователь @{message.from_user.username} обратился в поддержку."
        f"\nАйди для обратной связи:\n{message.from_user.id}"
    )
)
    send_application_email('oleggolovko087@gmail.com', 'Новая заявка')

def send_news():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Получаем текущие новости, которые нужно отправить по времени
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M")
    cursor.execute("SELECT text, photo FROM news_send WHERE time = ?", (current_time,))
    news = cursor.fetchall()
    
    # Если новости найдены, отправляем их всем пользователям
    if news:
        for text, photo in news:
            # Отправка текстовой новости
            for user in get_all_users():
                if text:
                    bot.send_message(chat_id=user, text=text)
                if photo:
                    bot.send_photo(chat_id=user, photo=photo)
    
    conn.close()

def get_all_users():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("SELECT userid FROM user_history")
    users = [row[0] for row in cursor.fetchall()]
    conn.close()
    return users


def get_contract(message:Message):
    bot.send_message(chat_id=message.chat.id, text=get_contract_info_text(message), reply_markup=back_reply_markup)


def start_polling():
    try:
        bot.infinity_polling(none_stop=True)
    except:
        start_infinity_polling()



def start_bot():
    schedule.every().minute.do(send_news)
    while True:
        schedule.run_pending()
        sleep(1)

polling_thread = threading.Thread(target=start_polling)
polling_thread.start()
try:
    start_bot()
except:
    start_bot()
