import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import random
import string

SENDER_EMAIL = 'ttk-help@yandex.ru'
SENDER_PASSWORD = 'acpsdbinvtlvfbwy'

def generate_auth_code(length=6):
    """Генерирует случайный код авторизации заданной длины."""
    characters = string.digits  
    return ''.join(random.choice(characters) for _ in range(length))


def send_mail(receiver_email, confirmation_code):
    smtp_server = "smtp.yandex.ru"  
    smtp_port = 465  

    
    msg = MIMEMultipart('alternative')
    msg['From'] = SENDER_EMAIL
    msg['To'] = receiver_email
    msg['Subject'] = 'Ваш код авторизации для службы поддержки ТТК'

    html_content = f"""
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Код подтверждения</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
                text-align: center;
                color: #333;
            }}
            .container {{
                background: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                display: inline-block;
            }}
            h1 {{
                color: #0056b3;
            }}
            .code {{
                margin-top: 20px;
                font-size: 24px;
                color: #28a745; /* Цвет для успешного сообщения */
                font-weight: bold;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <img src="https://sun9-54.userapi.com/impg/vosDEsrkbXG6diSYYloVqVZVaVBQqh-7A7-gAQ/YgK5Xeu3mRU.jpg?size=604x451&quality=96&sign=b1127c3540ab5cd47bb7f67435bfadbe&type=album" alt="Логотип компании">
            <h1>Ваш код подтверждения</h1>
            <p>Спасибо за использование нашего сервиса!</p>
            <div class="code">Ваш код: {confirmation_code}</div>
            <p>Пожалуйста, введите этот код на сайте для подтверждения.</p>
        </div>
    </body>
    </html>
    """

    msg.attach(MIMEText(html_content, 'html'))
    try:
        server = smtplib.SMTP_SSL(smtp_server, smtp_port)
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, receiver_email, msg.as_string())
        print("Письмо успешно отправлено")
    except Exception as e:
        print(f"Ошибка при отправке письма: {e}")
    finally:
        server.quit()


def send_application_email(receiver_email, application_text):
    smtp_server = "smtp.yandex.ru"  
    smtp_port = 465  

    
    msg = MIMEMultipart('alternative')
    msg['From'] = SENDER_EMAIL
    msg['To'] = receiver_email
    msg['Subject'] = 'Регистрация новой заявки'

    html_content = f"""
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Заявка</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
                text-align: center;
                color: #333;
            }}
            .container {{
                background: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                display: inline-block;
            }}
            h1 {{
                color: #black;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <img src="https://sun9-54.userapi.com/impg/vosDEsrkbXG6diSYYloVqVZVaVBQqh-7A7-gAQ/YgK5Xeu3mRU.jpg?size=604x451&quality=96&sign=b1127c3540ab5cd47bb7f67435bfadbe&type=album" alt="Логотип компании">
            <h1>Новая заявка</h1>
            <p>{application_text}</p>
        </div>
    </body>
    </html>
    """

    msg.attach(MIMEText(html_content, 'html'))
    try:
        server = smtplib.SMTP_SSL(smtp_server, smtp_port)
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, receiver_email, msg.as_string())
        print("Письмо успешно отправлено")
    except Exception as e:
        print(f"Ошибка при отправке письма: {e}")
    finally:
        server.quit()
