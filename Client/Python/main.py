import json
import os
import requests

service_config = {
    "port": 3030,
    "url": "127.0.0.1",
    "serviceName": "Example software name"
}

async def licence_checker():
    print('Checking if you are already activate the software...')

    if not os.path.exists("key.db"):
        await get()
    else:
        with open('key.db', 'r', encoding='utf-8') as file:
            data = file.read()
            if data:
                lines = data.split("\n")
                try:
                    response = requests.post(
                        f"http://{service_config['url']}:{service_config['port']}/license/login",
                        json={"key": lines[0]},
                        headers={'Content-type': 'application/json; charset=UTF-8'}
                    )
                    states = response.json()

                    if states.get('success'):
                        print(f"Yeah, {service_config['serviceName']} is activate !")
                        print("-----> Starting The Software...")
                        # starting ...
                        start()
                    else:
                        if states.get('error') == "Bad ip with your key !":
                            start()
                        else:
                            await get()
                except Exception as error:
                    print(error)

async def get():
    answer = input(f"Hey, {service_config['serviceName']} is not free ! Do you have key? If you here, i think is yes ! Type you key please :\nkey ~> ")
    print('[API] >> Checking if your key is available')

    try:
        response = requests.post(
            f"http://{service_config['url']}:{service_config['port']}/license/login",
            json={"key": answer},
            headers={'Content-type': 'application/json; charset=UTF-8'}
        )
        states = response.json()

        if states.get('success'):
            print(f"Yeah, you just activate {service_config['serviceName']}, gg !")
            # writing in db
            with open('key.db', 'w', encoding='utf-8') as file:
                file.write(f"{answer}\nby Kisakay with <3")
            # the software:
            start()
            return
        
        if states.get('error') == "Key doesn't exist":
            print("No, this key is not correct ! Please contact support, if you don't have key !")
            exit(1)
        elif states.get('error') == "Bad ip with your key !":
            print("Your key is not associed to this ip ! Please disable your vpn or switch to classical connections !\nFor more informations please contact the support !\nIf you don't know, 1* Key is for 1* People !")
            exit(1)
    except Exception as error:
        print(error)

def start():
    # Your Software Here:
    pass

# Lancement du programme
if __name__ == "__main__":
    import asyncio
    asyncio.run(licence_checker())

# made by Kisakay