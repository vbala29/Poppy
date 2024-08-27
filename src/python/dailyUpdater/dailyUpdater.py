import requests

def update_daily_info():
    url = 'http://localhost:3000/api/cron'
    try:
        response = requests.get(url)
        if response.status_code == 200:
            print('Daily cron ran successfully. Response:', response.json())
        else:
            print('Daily cron failed with code:', response.status_code)
    except Exception as e:
        print('An error occurred:', e)

if __name__ == '__main__':
    update_daily_info()