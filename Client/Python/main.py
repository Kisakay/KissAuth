import requests
import json
import os
from colorama import init, Fore, Style

# Initialiser colorama pour Windows
init()

service_config = {
    "port": 3030,
    "url": "127.0.0.1",
    "service_name": "Example software name"
}

IPIFY_ENDPOINT_IPV4 = 'https://api.ipify.org'
IPIFY_ENDPOINT_IPV6 = 'https://api6.ipify.org'

def ipify(use_ipv6=True, endpoint=None):
    if endpoint is None:
        endpoint = IPIFY_ENDPOINT_IPV6 if use_ipv6 else IPIFY_ENDPOINT_IPV4

    try:
        response = requests.get(endpoint)
        response.raise_for_status()
        return response.text
    except requests.exceptions.RequestException as e:
        raise Exception(f"Failed to fetch IP address: {e}")

def licence_checker():
    print(Fore.YELLOW + 'Checking if you are already activate the software...')
    my_ip = ipify(use_ipv6=False)

    if not os.path.exists("key.db"):
        get()
    else:
        with open('key.db', 'r') as file:
            data = file.read()
            if data:
                lines = data.split("\n")
                response = requests.post(f"http://{service_config['url']}:{service_config['port']}/api/json", 
                                         json={"adminKey": "unknow", "ip": my_ip, "key": lines[0], "tor": "LOGIN_KEY"})
                json_response = response.json()
                status_srv = json_response.get('title', '')
                if status_srv == 'Succeful':
                    print(Fore.GREEN + f"Yeah, {service_config['service_name']} is activate !")
                    print("-----> Starting The Software...")
                    start()
                else:
                    if status_srv == "Bad ip with your key !":
                        start()
                    else:
                        get()

def get():
    my_ip = ipify(use_ipv6=False)
    answer = input(Fore.RED + f"Hey, {service_config['service_name']} is not free ! Do you have key? If you here, i think is yes ! Type you key please :\n" + Style.RESET_ALL + "key ~> ")
    print(Fore.GREEN + '[API] >> Checking if your key is available' + Style.RESET_ALL)
    response = requests.post(f"http://{service_config['url']}:{service_config['port']}/api/json", 
                             json={"adminKey": "unknow", "ip": my_ip, "key": answer, "tor": "LOGIN_KEY"})
    json_response = response.json()
    status_srv = json_response.get('title', '')
    if status_srv == 'Succeful':
        print(Fore.GREEN + f"Yeah, you just activate {service_config['service_name']}, gg !" + Style.RESET_ALL)
        with open('key.db', 'w') as file:
            file.write(f"{answer}\nby Kisakay with <3")
        start()
    elif status_srv == "Your key is not unvailable !":
        print(Fore.RED + "No, this key is not correct ! Please contact support, if you don't have key !" + Style.RESET_ALL)
    elif status_srv == "Bad ip with your key !":
        print(Fore.RED + "Your key is not associed to this ip ! Please disable your vpn or switch to classical connections !\nFor more informations please contact the support !\nIf you don't know, 1* Key is for 1* People !" + Style.RESET_ALL)

def start():
    # Your Software Here
    pass

# made by Kisakay

licence_checker()
