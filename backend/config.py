from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import SecretStr

# import os 
# import sys
# from pathlib import Path

# if getattr(sys, 'frozen', False):
#     ROOT_DIR = Path(sys.executable).absolute()
# else:
#     ROOT_DIR = Path(__file__).parent.absolute()


# DATASHEETS_DIR = os.path.join(ROOT_DIR, 'Datasheets')

class Setting(BaseSettings):
    bot_token : SecretStr

    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8')



settings = Setting()