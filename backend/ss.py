import sqlite3
import hashlib
import random
import string

# Путь к базе данных
DB_PATH = 'database.db3'

def generate_password(length=8):
    """Генерирует случайный пароль заданной длины."""
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

with open('pass', 'w') as file:
    n = 0
    while n < 9:
        password = generate_password()
        file.write(password + '\n')
        n += 1
    file.close()

def hash_password(password):
    """Хеширует пароль с использованием SHA-256."""
    return hashlib.sha256(password.encode()).hexdigest()

def update_contracts_with_passwords(db_path=DB_PATH):
    """Добавляет захешированные пароли в таблицу contracts."""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Проверка, что столбец password добавлен в таблицу contracts
    cursor.execute("PRAGMA table_info(contracts)")
    columns = [column[1] for column in cursor.fetchall()]
    
    if 'password' not in columns:
        cursor.execute("ALTER TABLE contracts ADD COLUMN password TEXT")
    
    # Обновление каждого пользователя случайным захешированным паролем
    cursor.execute("SELECT id FROM contracts")
    users = cursor.fetchall()
    
    for (user_id,) in users:
        plain_password = generate_password()
        hashed_password = hash_password(plain_password)
        
        cursor.execute("""
            UPDATE contracts
            SET password = ?
            WHERE id = ?
        """, (hashed_password, user_id))
    
    conn.commit()
    conn.close()
    print("Таблица contracts обновлена с захешированными паролями.")

# Запуск функции
update_contracts_with_passwords()
