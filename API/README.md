# BackFrontDevops

window =

Installer l'environnement

mac os=

    - python3 -m venv .venv
    - source .venv/bin/activate

windows =

    - python -m venv .venv
    - .venv\Scripts\activate

Installer les libraries

- pip install "fastapi[standard]"
- pip install sqlmodel
- pip install pyjwt

Lancer le serveur

- fastapi dev main.py
