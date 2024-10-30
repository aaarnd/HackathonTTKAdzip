from telebot.types import ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardMarkup, InlineKeyboardButton

start_markup = InlineKeyboardMarkup(row_width=2)
start_markup.add(InlineKeyboardButton(
                text = 'Я являюсь абонентом ТТК',
                callback_data='have_contract'
                ),
                InlineKeyboardButton(
                text = 'Я хочу заключить договор',
                callback_data='doesnt_have_contract'
                ),
)

def pass_markup_create(contract):
    pass_markup = InlineKeyboardMarkup()
    pass_markup.add(InlineKeyboardButton(
                        text='Я не помню свой пароль',
                        callback_data=f'reset_{contract}'
                    ),
                    InlineKeyboardButton(
                        text='⬅',
                        callback_data='back'
                    ))
    return pass_markup

back_markup = InlineKeyboardMarkup()
back_markup.add(InlineKeyboardButton(
                    text='⬅',
                    callback_data='back'
                ))

def handle_intent_markup_create(intent):
    intent_markup = InlineKeyboardMarkup()
    intent_markup.add(InlineKeyboardButton(
                    text = 'Продолжить',
                    callback_data=f'continue_{intent}'
                    ),
                    InlineKeyboardButton(
                    text = '⬅',
                    callback_data='back'
                    ),
    )
    return intent_markup

menu_markup = ReplyKeyboardMarkup(resize_keyboard=True)
menu_markup.row(KeyboardButton(
                    text='Посмотреть доступные тарифы',
                ),
                KeyboardButton(
                    text='Посмотреть доступные услуги',
                ))
menu_markup.row(KeyboardButton(
                    text='Личный кабинет',
                ),
                KeyboardButton(
                    text='Обратиться в поддержку',
                ))
menu_markup.add(KeyboardButton(
                    text='Выйти',
                ))

tariffs_markup = ReplyKeyboardMarkup(resize_keyboard=True)
tariffs_markup.row(KeyboardButton(
                    text='Я хочу поменять тариф',
                ))
tariffs_markup.row(
                KeyboardButton(
                    text='Назад',
                ))

options_markup = ReplyKeyboardMarkup(resize_keyboard=True)
options_markup.row(KeyboardButton(
                    text='Я хочу сменить свои услуги',
                ))
options_markup.row(
                KeyboardButton(
                    text='Назад',
                ))

back_reply_markup = ReplyKeyboardMarkup(resize_keyboard=True)
back_reply_markup.row(
                KeyboardButton(
                    text='Назад',
                ))
