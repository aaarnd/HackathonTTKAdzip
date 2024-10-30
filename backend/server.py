# Import required libraries
from flask import Flask, request, jsonify
import sqlite3
import hashlib
import jwt
import datetime
import os
import hmac
from flask_cors import CORS
from functools import wraps

app = Flask(__name__)
app.config['SECRET_KEY'] = ''
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CORS(app)
# Helper function to connect to the database
def get_db_connection():
    conn = sqlite3.connect('database.db3')
    conn.row_factory = sqlite3.Row
    return conn

# Initialize database with admin user if not present
def initialize_admin():
    conn = get_db_connection()
    admin_user = conn.execute('SELECT * FROM users WHERE username = ?', ('admin',)).fetchone()
    if not admin_user:
        password = 'ttk_help'
        hashed_password = hashlib.sha256(password.encode()).hexdigest()  # Хешируем пароль
        conn.execute('INSERT INTO users (username, password, role, personal_info) VALUES (?, ?, ?, ?)', ('admin', hashed_password, 'admin',"Самый Главный Админ"))
        conn.commit()
    conn.close()
# Token authentication decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Проверяем наличие заголовка Authorization
        if 'Authorization' in request.headers:
            # Получаем токен, удаляя 'Bearer '
            token = request.headers['Authorization'].split()[1]

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            # Декодируем токен с помощью вашего секретного ключа
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            print(data)
            current_user = data['username']  # Извлекаем информацию о пользователе, если нужно
        except jwt.ExpiredSignatureError:
            print("Token has expired!")
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            print('Invalid token!')
            return jsonify({'message': 'Invalid token!'}), 401

        return f(current_user, *args, **kwargs)
    
    return decorated
    
@app.route('/admin/api/intents/<int:id>', methods=['DELETE'])
def delete_intent(id):
    conn = get_db_connection()
    cursor = conn.execute('DELETE FROM intents WHERE id = ?', (id,))
    conn.commit()
    conn.close()

    if cursor.rowcount:
        return jsonify({'message': 'Intent deleted successfully!'})
    else:
        return jsonify({'message': 'Intent not found!'}), 404
        
@app.route('/admin/api/intents/<int:id>', methods=['PUT'])
def edit_intent(id):
    data = request.get_json()
    intent_name = data.get('intent_name')
    keywords = data.get('keywords')
    response_text = data.get('response_text')
    email = data.get("email")

    conn = get_db_connection()
    cursor = conn.execute(
        'UPDATE intents SET intent_name = ?, keywords = ?, response_text = ?, email = ? WHERE id = ?',
        (intent_name, keywords, response_text, email, id)
    )
    conn.commit()
    conn.close()

    if cursor.rowcount:
        return jsonify({'message': 'Intent updated successfully!'})
    else:
        return jsonify({'message': 'Intent not found!'}), 404

@app.route('/admin/api/intents', methods=['POST'])
def add_intent():
    data = request.get_json()
    print(data)
    intent_name = data.get('intent_name')
    keywords = data.get('keywords')
    response_text = data.get('response_text')
    email = data.get("email")

    conn = get_db_connection()
    conn.execute(
        'INSERT INTO intents (intent_name, keywords, response_text, email) VALUES (?, ?, ?, ?)',
        (intent_name, keywords, response_text, email)
    )
    conn.commit()
    conn.close()

    return jsonify({'message': 'Intent added successfully!'}), 201


# --- User Management Routes ---
@app.route('/admin/api/sessions', methods=['GET'])
def get_sessions():
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT created_at, username, subjects FROM sessions ORDER BY created_at DESC')
            rows = cursor.fetchall()

        # Форматируем данные для ответа
        sessions = []
        for row in rows:
            session_data = {
                'date': row['created_at'],
                'username': row['username'],
                'action': row['subjects'],
            }
            sessions.append(session_data)

        return jsonify(sessions), 200
    except Exception as e:
        print(f"Ошибка получения сессий: {e}")
        return jsonify({'error': 'Ошибка получения данных сессий'}), 500

@app.route('/admin/api/posts', methods=['POST'])
def create_post():
    try:
        # Получение текстовых данных из формы
        date = request.form.get('date')
        time = request.form.get('time')
        message = request.form.get('message')
        # Проверка на обязательные поля
        if not date or not time or not message:
            return jsonify({'error': 'Все обязательные поля должны быть заполнены'}), 400
        try:
            datetime_combined = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")
            print(datetime_combined)
        except ValueError:
            return jsonify({'error': 'Неверный формат даты или времени'}), 400

        # Получение файла фото, если он был загружен
        photo = request.files.get('photo')
        if photo:
            # Сохранение файла на сервере
            photo_path = os.path.join(app.config['UPLOAD_FOLDER'], photo.filename)
            photo.save(photo_path)
        else:
            photo_path = None
            
        conn = get_db_connection()
        conn.execute('INSERT INTO news_send (text, photo, time) VALUES (?, ?, ?)', (message, photo_path, datetime_combined))
        conn.commit()
        conn.close()
        # Здесь можно добавить логику для сохранения данных в базу данны

        return jsonify({'message': 'Пост успешно создан'}), 201
    except Exception as e:
        print(f"Ошибка: {e}")
        return jsonify({'error': 'Ошибка при создании поста'}), 500

@app.route('/admin/api/tariffs', methods=['GET'])
def get_tariffs():
    conn = get_db_connection()
    tariffs = conn.execute('SELECT * FROM tariffs').fetchall()
    conn.close()
    return jsonify([dict(tariff) for tariff in tariffs])

# Добавление нового тарифа
@app.route('/admin/api/tariffs', methods=['POST'])
def add_tariff():
    data = request.get_json()
    print(data)
    name = data.get('name')
    description = data.get('description')
    price = data.get('price')

    conn = get_db_connection()
    conn.execute('INSERT INTO tariffs (name, description, price) VALUES (?, ?, ?)', (name, description, price))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Tariff added successfully!'}), 201
    
@app.route('/admin/api/tariffs/<int:id>', methods=['DELETE'])
def delete_tariff(id):
    conn = get_db_connection()
    cursor = conn.execute('DELETE FROM tariffs WHERE id = ?', (id,))
    conn.commit()
    conn.close()

    if cursor.rowcount:
        return jsonify({'message': 'Tariff deleted successfully!'})
    else:
        return jsonify({'message': 'Tariff not found!'}), 404

# Удаление услуги
@app.route('/admin/api/options/<int:id>', methods=['DELETE'])
def delete_option(id):
    conn = get_db_connection()
    cursor = conn.execute('DELETE FROM options WHERE id = ?', (id,))
    conn.commit()
    conn.close()

    if cursor.rowcount:
        return jsonify({'message': 'Option deleted successfully!'})
    else:
        return jsonify({'message': 'Option not found!'}), 404
# Обновление тарифа

@app.route('/admin/api/tariffs/<int:id>', methods=['PUT'])
def update_tariff(id):
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    price = data.get('price')

    conn = get_db_connection()
    conn.execute('UPDATE tariffs SET name = ?, description = ?, price = ? WHERE id = ?', (name, description, price, id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Tariff updated successfully!'})

# Получение всех услуг
@app.route('/admin/api/options', methods=['GET'])
def get_options():
    conn = get_db_connection()
    options = conn.execute('SELECT * FROM options').fetchall()
    conn.close()
    return jsonify([dict(option) for option in options])

# Добавление новой услуги
@app.route('/admin/api/options', methods=['POST'])
def add_option():
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    price = data.get('price')

    conn = get_db_connection()
    conn.execute('INSERT INTO options (name, description, price) VALUES (?, ?, ?)', (name, description, price))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Option added successfully!'}), 201

# Обновление услуги
@app.route('/admin/api/options/<int:id>', methods=['PUT'])
def update_option(id):
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    price = data.get('price')

    conn = get_db_connection()
    conn.execute('UPDATE options SET name = ?, description = ?, price = ? WHERE id = ?', (name, description, price, id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Option updated successfully!'})

@app.route('/admin/users/create', methods=['POST'])
@token_required
def create_user(current_user):
    data = request.get_json()
    print(data)
    username = data.get('username')
    hashed_password = data.get('hashed_password')
    fio=f"{data.get('surname')}_{data.get('name')}_{data.get('patronymic')}"
    role = data.get('role')
    print(fio)
    conn = get_db_connection()
    conn.execute('INSERT INTO users (username, password, role, personal_info) VALUES (?, ?, ?, ?)',
                 (username, hashed_password, role,fio))
    conn.commit()
    conn.close()

    return jsonify({'message': 'New user created successfully!'})

@app.route('/admin/users/delete/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    conn = get_db_connection()
    conn.execute('DELETE FROM users WHERE id = ?', (user_id,))
    conn.commit()
    conn.close()

    return jsonify({'message': 'User deleted successfully!'})

@app.route('/admin/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    users = conn.execute('SELECT id, username, role, personal_info FROM users').fetchall()
    conn.close()
    return jsonify([dict(user) for user in users])

@app.route('/admin/users/update_role/<int:user_id>', methods=['PATCH'])
def update_user_role(user_id):
    data = request.get_json()
    role = data.get('role')
    conn = get_db_connection()
    conn.execute('UPDATE users SET role = ? WHERE id = ?', (role, user_id))
    conn.commit()
    conn.close()

    return jsonify({'message': 'User role updated successfully!'})

@app.route('/admin/api/sessions', methods=['POST'])
def create_session():
    data = request.json
    print(data)
    username = data.get('username')
    subject = data.get('subjects')
    print(username,subject)
    if not username or not subject:
        print('Необходимо указать username и subject')
        return jsonify({'error': 'Необходимо указать username и subject'}), 400

    try:
        # Запись действия в таблицу `sessions`
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO sessions (username, subjects) 
                VALUES (?, ?)
            ''', (username, subject))
            conn.commit()
        print('Активность успешно записана')
        return jsonify({'message': 'Активность успешно записана'}), 201
    except Exception as e:
        print(f"Ошибка записи сессии: {e}")
        return jsonify({'error': 'Ошибка записи активности'}), 500

@app.route('/admin/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    hashed_password = data.get('hashed_password')  # Получаем хэшированный пароль от клиента
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
    conn.close()

    # Проверяем, совпадает ли хэшированный пароль
    if user and user['password'] == hashed_password:
        print(user)
        token = jwt.encode({
            'username': username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        return jsonify({'token': token, "role": user["role"], "personal_info": user["personal_info"]})
    else:
        print(jsonify({'message': 'Login failed!'}), 401)
        return jsonify({'message': 'Login failed!'}), 401
        
@app.route('/admin/auth/logout', methods=['POST'])
@token_required
def logout(current_user):
    return jsonify({'message': 'Logged out successfully!'})

# --- Intent Management Routes ---

@app.route('/admin/api/intents', methods=['GET'])
def get_all_intents():
    conn = get_db_connection()
    intents = conn.execute('SELECT * FROM intents').fetchall()
    conn.close()

    intents_list = [
        {
            'id': intent['id'],
            'intent_name': intent['intent_name'],
            'keywords': intent['keywords'],
            'response_text': intent['response_text'],
            "email" : intent["email"]
        }
        for intent in intents
    ]

    return jsonify(intents_list), 200

# Initialize admin user and run the app
if __name__ == '__main__':
    initialize_admin()
    app.run(host="5.35.92.45", port=8080)
