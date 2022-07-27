import zipimport
import geocoder
import pandas as pd
from pyDataverse.api import NativeApi, DataAccessApi
from pyDataverse.models import Dataverse
import xlrd
from time import sleep
import json

DOI = "doi:10.5072/FK2/JGT4GH"
API_TOKEN = "ac71d785-30b7-4fd0-9c16-6cf118783533"
BASE_URL = "https://datacommons.tdai.osu.edu"
datasets = ["Jackson", "Scioto"]



api = NativeApi(BASE_URL, API_TOKEN)
data_api = DataAccessApi(BASE_URL, API_TOKEN)
anchor_latlng = [38.963592, -82.815316]

def df_to_geojson(jackson_data, name):
    addresses_checked = {}
    jackson_geojson  = {"type": "FeatureCollection", "features": []}
    for row in jackson_data.itertuples():
        address1 = str(row[5])
        address2 = str(row[6])
        city = str(row[7])
        zip = str(row[8])
        final_geocode_address = address1 + ", " + address2 + ", " + city + ", " + "Ohio, " + zip
        #final_geocode_address.replace("nan,", "")
        if final_geocode_address not in addresses_checked.keys():
            try:
                    print(final_geocode_address)
                    g = geocoder.mapbox(final_geocode_address, key="pk.eyJ1IjoibXJhbHBhY2EiLCJhIjoiY2pyYmV5dWg4MTJheDQzcGNxeGtleWx0bCJ9.SwBpLsVT9FGuA9JoEHg60w", proximity=anchor_latlng)
                    addresses_checked[final_geocode_address] = g.latlng
                    latlng = g.latlng
                    print(g.address)
            except:
                latlng = False
                addresses_checked[final_geocode_address] = latlng
        else:
            latlng = addresses_checked[final_geocode_address]  

        if latlng:    
            feature = {"type": "Feature", "geometry": {"type": "Point", "coordinates": [latlng[1], latlng[0]]}, "properties": {"name": str(row[1]), "address": final_geocode_address, "zip": zip, "city": str(row[7]), "state": str(row[4]), "county": str(row[3])}}
        jackson_geojson["features"].append(feature)
        with open(name+'.geojson', 'w') as fp:
            json.dump(jackson_geojson, fp) 

dataset = api.get_dataset(DOI) 
files_list = dataset.json()['data']['latestVersion']['files']

for  file in files_list:
    filename = file["dataFile"]["filename"]
    if "OIBRS" in filename and "Jackson" in filename:
        file_id = file["dataFile"]["id"]
        response = data_api.get_datafile(file_id)
        with open(filename, "wb") as f:
            f.write(response.content)
            f.close()
    elif "OIBRS Scioto County.tab" in filename:
        file_id = file["dataFile"]["id"]
        response = data_api.get_datafile(file_id)
        with open(filename, "wb") as f:
            f.write(response.content)
            f.close()

jackson_data = pd.read_csv('OIBRS Jackson County Data.tab', sep="\t")
scioto_data = pd.read_csv('OIBRS Scioto County.tab', sep="\t")

df_to_geojson(jackson_data, "Jackson County OIBRS")
df_to_geojson(scioto_data, "Scioto County OIBRS")





    


    







