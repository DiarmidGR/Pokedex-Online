import requests
from bs4 import BeautifulSoup
import json
from urllib.parse import urlparse


def get_data():
    # List of URLs to scrape
    urls = [
        "https://pokemondb.net/pokedex/game/red-blue-yellow",
        "https://pokemondb.net/pokedex/game/gold-silver-crystal",
        "https://pokemondb.net/pokedex/game/ruby-sapphire-emerald",
        "https://pokemondb.net/pokedex/game/firered-leafgreen",
        "https://pokemondb.net/pokedex/game/diamond-pearl",
        "https://pokemondb.net/pokedex/game/platinum",
        "https://pokemondb.net/pokedex/game/heartgold-soulsilver",
        "https://pokemondb.net/pokedex/game/black-white",
        "https://pokemondb.net/pokedex/game/black-white-2",
        "https://pokemondb.net/pokedex/game/x-y",
        "https://pokemondb.net/pokedex/game/omega-ruby-alpha-sapphire",
        "https://pokemondb.net/pokedex/game/sun-moon",
        "https://pokemondb.net/pokedex/game/ultra-sun-ultra-moon",
        "https://pokemondb.net/pokedex/game/lets-go-pikachu-eevee",
        "https://pokemondb.net/pokedex/game/sword-shield",
        "https://pokemondb.net/pokedex/game/brilliant-diamond-shining-pearl",
        "https://pokemondb.net/pokedex/game/legends-arceus",
        "https://pokemondb.net/pokedex/game/scarlet-violet",
        "https://pokemondb.net/pokedex/national"
    ]

    # Dictionary to hold all the Pokémon data
    all_pokedex_data = {}

    for url in urls:
        # Extract the final part of the URL to use as a key in the JSON file
        url_key = urlparse(url).path.split('/')[-1]

        # Send a GET request to the URL
        response = requests.get(url)
        response.raise_for_status()  # Check that the request was successful

        # Parse the HTML content
        soup = BeautifulSoup(response.text, 'html.parser')

        # Dictionary to hold the pokemon data for each category
        category_data = {}

        # Flag to check if multiple categories are found
        multiple_categories = False

        # Find all h2 elements followed by divs with class "infocard-list"
        for h2 in soup.find_all('h2'):
            # Get the category name from the h2 element
            category_name = h2.text.strip()

            # Find the next sibling div with class "infocard-list"
            infocard_list = h2.find_next_sibling('div', class_='infocard-list')

            if infocard_list:
                multiple_categories = True

                # List to hold the pokemon data for the current category
                pokedex = []

                # Find all infocard divs within this infocard-list
                infocards = infocard_list.find_all('div', class_='infocard')

                # Extract the relevant data from each infocard
                for card in infocards:
                    # Get the span with class "infocard-lg-data"
                    data_span = card.find('span', class_='infocard-lg-data')

                    if data_span:
                        # Extract the number from the small tag
                        number = data_span.find('small').text.strip().replace('#', '')

                        # Extract the name from the anchor tag
                        name = data_span.find('a').text.strip()

                        # Append the data to the pokedex list
                        pokedex.append({
                            'number': number,
                            'name': name
                        })

                # Add the current category's pokedex data to the category data dictionary
                category_data[category_name] = pokedex

        # If no multiple categories found, store under "regional"
        if not multiple_categories:
            # List to hold the pokemon data for the "regional" category
            pokedex = []

            # Find all infocard divs
            infocards = soup.find_all('div', class_='infocard')

            # Extract the relevant data from each infocard
            for card in infocards:
                # Get the span with class "infocard-lg-data"
                data_span = card.find('span', class_='infocard-lg-data')

                if data_span:
                    # Extract the number from the small tag
                    number = data_span.find('small').text.strip().replace('#', '')

                    # Extract the name from the anchor tag
                    name = data_span.find('a').text.strip()

                    # Append the data to the pokedex list
                    pokedex.append({
                        'number': number,
                        'name': name
                    })

            # Add the "regional" category's pokedex data to the category data dictionary
            category_data['Regional'] = pokedex

        # Add the current URL's category data to the main dictionary
        all_pokedex_data[url_key] = category_data

    # Define the output file
    output_file = 'pokedex-data.json'

    # Write the data to a JSON file
    with open(output_file, 'w') as f:
        json.dump(all_pokedex_data, f, indent=2)

    print(f"Pokémon data has been successfully saved to {output_file}")

