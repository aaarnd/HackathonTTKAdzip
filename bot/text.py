import sqlite3

start_text = 'Здравствуйте, вас приветствует служба поддержки компании ТрансТелеком. Пожалуйста, авторизуйтесь для начала работы.'
ident_text = 'Пожалуйста, введите cвой номер договора.'
auth_text = 'На почту, указанную вами в договоре отправлен 6-и значный код для авторизации. Введите его, чтобы продолжить.'
wrong_contract_text = 'Указанного вами договора нету в базе. Проверьте правильность введеных данных и введите их заного или заключите договор, если не являетесь абонентом ТТК.'
send_password_text = 'Договор с указанным Вами номером найден. Введите пароль.'
auth_success_text = 'Вы успешно авторизованы. Пожалуйста, выберите интересующую Вас услугу.'
wrong_password_text = 'Вы ввели неправильный пароль. Попробуйте снова'
menu_text = 'Пожалуйста, выберите интересующую вас услугу. Так же вы можете отправить голосовую команду с помощью функции отправки голосового сообщения.'
send_email_text = 'На почту, привязанную к данному договору, отправлено письмо с кодом для восстановления. Введите его следующим сообщением.'
too_many_requests_text = 'Вы совершили слишком много запросов, подождите немного.'
wrong_auth_code_text = 'Вы ввели неправильный код подтверждения. Попробуйте снова.'
request_number_text = 'Введите свой номер телефона.'
request_address_text = 'Введите свой адрес.'
successful_request_text = 'Мы получили ваши данные, с вами скоро свяжутся специалисты поддержки, ожидайте.'
wrong_number_format_text = 'Неверный формат номера.'
request_already_exists_text = 'На данный номер уже зарегистрирована заявка на заключение договора.'
successful_logout_text = 'Успешно.'
change_tariff_request_text = 'Вы оставили заявку на смену тарифа, ожидайте звонка от специалиста.'
change_options_request_text = 'Вы оставили заявку на смену услуги, ожидайте звонка от специалиста.'
get_help_text = 'Ваша заявка успешно обработана, скоро к вам в чат присоединится специалист'


tariffs_and_options_chat_support="-4599476097"
contract_chat_support="-4531938649"

def get_tariffs_reply_text():
    conn = sqlite3.connect('database.db3')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tariffs")
    result=cursor.fetchall()
    string="Доступные тарифы:\n"
    for row in result:
        string+=f"{row[0]}. {row[1]}: {row[2]}. Цена: {row[3]}\n"
    conn.close()
    return string

def get_options_reply_text():
    conn = sqlite3.connect('database.db3')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM options")
    result=cursor.fetchall()
    string="Доступные услуги:\n"
    for row in result:
        string+=f"{row[0]}. {row[1]}: {row[2]}. Цена: {row[3]}\n"
    conn.close()
    return string

def get_contract_info_text(message):
    conn = sqlite3.connect('database.db3')
    cursor = conn.cursor()
    cursor.execute("SELECT contract FROM user_history WHERE userid = ?", (message.from_user.id, ))
    contract = cursor.fetchone()
    cursor.execute('SELECT contracts.contract, contracts.userdata, contracts.email, contracts.phonenumber, tariffs.name, contracts.options FROM contracts JOIN tariffs ON contracts.tariff = tariffs.id WHERE contract = ?', (contract))
    result=cursor.fetchone()
    string="Личный кабинет:\n"
    if len(result[5]) <1:
        string+='отсутствуют'
    else:
        adds=""
        print(result[5])
        for i in range(0, len(result[5]), 3):
            cursor.execute("SELECT name FROM options WHERE id LIKE ?", (result[5][i]),)
            adds+=f"{cursor.fetchone()[0]}; "

    string+=f"Номер договора: {result[0]}\nЛичные данные: {result[1]}\nЭлектронная почта: {result[2]}\nНомер телефона: {result[3]}\nТариф: {result[4]}\nУслуги: {adds}"
    conn.close()
    return string
