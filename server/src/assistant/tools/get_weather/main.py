import os
import requests
from datetime import datetime, timedelta
from dotenv import load_dotenv
from utils.logger import logger

load_dotenv()

# takes in a dict with date and time and returns a unix timestamp
def convert_to_unix(time):
    if time.get('date') and time.get('time'):
        time_str = f"{time['date']} {time['time']}"
    elif time.get('date'):
        time_str = f"{time['date']} 12:00:00"

    dt = datetime.strptime(time_str, '%Y-%m-%d %H:%M:%S')
    logger.info(f"Converted time string {time_str} to unix timestamp: {int(dt.timestamp())}")
    return int(dt.timestamp())

async def location_to_coords(location, api_key):
    logger.info(f"Converting location to coordinates: {location}")
    try:
        combined_location = ''
        for key, value in location.items():
            if combined_location != '':
                combined_location += ', '
            if key == 'city':
                combined_location += value
            if key == 'state':
                combined_location += value
            if key == 'country':
                combined_location += value
        logger.info(f"Combined location: {combined_location}")
        response = requests.get(f'http://api.openweathermap.org/geo/1.0/direct?q={combined_location}&limit=1&appid={api_key}')
        data = response.json()
        logger.info(f"Converted location {location} to coordinates: {data[0]['lat']}, {data[0]['lon']}")
        return data[0]['lat'], data[0]['lon']
    except Exception as e:
        logger.error(f"Error converting location to coordinates: {e}")
        return None, None
    
def round_temp_str(temp):
    return str(round(float(temp)))


async def get_weather(location, unit, time, api_key, language = 'en'):
    logger.info(f"Getting weather for location: {location}, unit: {unit}, time: {time}, language: {language}")

    try:
        coords = await location_to_coords(location, api_key)
        logger.info(f"Converted location to coordinates: {coords}")


        if time in ['now', 'today', 'current time', None]:
            logger.info("Getting current weather")
            call_type = 'weather'
        else: 
            logger.info("Getting forecast")
            call_type = 'forecast'
            unix_time = convert_to_unix(time)
            logger.info(f"Converted time to unix: {unix_time}")

            if (unix_time > (datetime.now() + timedelta(days=5)).timestamp()):
                logger.warning("Requested time is more than 5 days in the future")
                return {'response': 'Sorry, I can only give you the weather within the next 5 days.'}
            if (unix_time < datetime.now().timestamp()):
                logger.warning("Requested time is in the past")
                return {'response': 'Sorry, as of now, I cannot give you past weather.'}

        openweather_request_url = f'http://api.openweathermap.org/data/2.5/{call_type}?lat={coords[0]}&lon={coords[1]}&appid={api_key}&units={unit}&lang={language}'
        logger.info(f"Sending request to: {openweather_request_url}")

        response = requests.get(openweather_request_url)
        data = response.json()
        logger.info(f"Received response: {data}")

        if call_type == 'weather':
            temperature = round_temp_str(data['main']['temp'])
            feels_like = round_temp_str(data['main']['feels_like'])
            description = data['weather'][0]['main']
            icon = data['weather'][0]['icon']
        elif call_type == 'forecast':
            closest_forecast = None
            smallest_difference = float('inf')

            for forecast in data['list']:
                current_difference = (forecast['dt'] - unix_time)
                logger.info(f"Current difference: {current_difference}")
                
                logger.info(f"Current difference: {current_difference}, Smallest_difference: {smallest_difference}")
                if (current_difference < smallest_difference):
                    smallest_difference = current_difference
                    closest_forecast = forecast

            temperature = round_temp_str(closest_forecast['main']['temp'])
            feels_like = round_temp_str(closest_forecast['main']['feels_like'])
            description = closest_forecast['weather'][0]['main']
            icon = closest_forecast['weather'][0]['icon']

        simple_response = {
            'temperature': temperature,
            'description': description,
        }

        complete_response = {
            'temperature': temperature,
            'feels_like': feels_like,
            'description': description,
            'icon': icon
        }
        return {
            'response': {
                'type': 'weather',
                'content': simple_response
            }
        }

    except Exception as e:
        logger.error(f"Error getting weather: {e}")
        return {'response': {
            'type': 'error',
            'content': f'Error getting weather: {e}'
        }}

# from utils.logger import logger

async def main(user, unit = None, location = None, time = None):
    logger.info(f"Running main function with user: {user}, unit: {unit}, location: {location}, time: {time}")
    try:
        api_key = os.getenv('OPENWEATHER_API_KEY')
        unit = 'imperial' if (unit or user['settings']['temp_unit']) == 'f' else 'metric'
        logger.info(f"Using unit: {unit}")
        logger.info(f"Using api_key: {api_key}")
        return await get_weather(location, unit, time, api_key)
    except Exception as e:
        logger.error(f"Error running tool get_weather: {e}")
        return {'response': f'Error running tool get_weather: {e}'}
    
get_weather = main

call_format = """
{
    "function_name": "get_weather",
    "description": "Called when the user wants to get the weather for a location, at a specific or non specific time." 
    "arguments": {
        "unit": "the unit to get the weather in 'f' or 'c', for farenheit or celcius.",
        "location": "the location to get the weather from.",
        "time": "the day or time of day to get the weather from, can be a specific time and day in the future or time of the current day."
    }
}
"""
examples = [
    {
        "user_message": """{ "current_date":"Saturday March 23,2024 12:00:00", "message":"Hey Ava what's the weather?"}""",
        "response": """{
            "function_name": "get_weather",
            "arguments": {
                "unit": "",
                "location": "",
                "time":""
            }
        }"""
    },
    {
        "user_message" : """{ "current_date":"Saturday March 23,2024 12:00:00", "message":"Hey Ava what's the weather in New York tomorrow?"}""",
        "response": """{
            "function_name": "get_weather",
            "arguments": {
                "unit": "",
                "location": "New York",
                "time":"3-24-2024"
            }
        }"""
    },
    {
        "user_message": """{ "current_date":"Saturday March 23,2024 12:00:00", "message":"Hey Ava what's the weather in Paris on Friday?"}""",
        "response": """{
            "function_name": "get_weather",
            "arguments": {
                "unit": "",
                "location": "Paris",
                "time":"3-25-2024"
            }
        }"""
    },
    {
        "user_message": """{ "current_date":"Saturday March 23,2024 12:00:00", "message":"Hey Ava what's the weather in London on March 26th?"}""",
        "response": """{
            "function_name": "get_weather",
            "arguments": {
                "unit": "",
                "location": "London",
                "time":"3-26-2024"
            }
        }"""
    },
    {
        "user_message": """{ "current_date":"Saturday March 23,2024 12:00:00", "message":"Hey Ava what's the weather in Berlin on Wednesday at 3 PM?"}""",
        "response": """{
            "function_name": "get_weather",
            "arguments": {
                "unit": "",
                "location": "Berlin",
                "time":"3-27-2024 15:00:00"
            }
        }"""
    },
    {
        "user_message": """{ "current_date":"Saturday March 23,2024 12:00:00", "message":"Hey Ava what's the weather in Sydney tomorrow?"}
        """,
        "response": """
            {
                "function_name": "get_weather",
                "arguments": {
                    "unit": "",
                    "location": "Sydney",
                    "time":"3-24-2024"
                }
            }
        """
    },
    {
        "user_message": """{ "current_date":"Saturday March 23,2024 12:00:00", "message":"Hey Ava what's the weather in Tokyo on March 28th?"}""",
        "response": """
            {
                "function_name": "get_weather",
                "arguments": {
                    "unit": "",
                    "location": "Tokyo",
                    "time":"3-28-2024"
                }
            }
        """
    },
    {
        "user_message": """{ "current_date":"Saturday March 23,2024 12:00:00", "message":"Hey Ava what's the weather in Rome on Thursday at 10 AM?"}""",
        "response": """
            {
                "function_name": "get_weather",
                "arguments": {
                    "unit": "",
                    "location": "Rome",
                    "time":"3-29-2024 10:00:00"
                }
            }
        """
    },
    {
        "user_message": """{ "current_date":"Saturday March 23,2024 12:00:00", "message":"Hey Ava what's the weather in London tomorrow in Celsius?"}""",
        "response": """
            {
                "function_name": "get_weather",
                "arguments": {
                    "unit": "c",
                    "location": "London",
                    "time":"3-24-2024"
                }
            }
        """
    },
    {
        "user_message": """{ "current_date":"Saturday March 23,2024 12:00:00", "message":"Hey Ava what's the weather in Paris on March 28th in Fahrenheit?"}""",
        "response": """
            {
                "function_name": "get_weather",
                "arguments": {
                    "unit": "f",
                    "location": "Paris",
                    "time":"3-28-2024"
                }
            }
        """
    },
    {
        "user_message": """{ "current_date":"Saturday March 23,2024 12:00:00", "message":"Hey Ava what's the weather at 2pm?"}""",
        "response": """
            {
                "function_name": "get_weather",
                "arguments": {
                    "unit": "",
                    "location": "",
                    "time":"3-23-2024 14:00:00"
                }
            }
        """
    }
]


