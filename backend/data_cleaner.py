from typing import final
import zipimport
import geocoder
import pandas as pd
from pyDataverse.api import NativeApi, DataAccessApi
from pyDataverse.models import Dataverse
import xlrd
from time import sleep
import json 
import urllib.parse
import requests

'''
DATA CLEANING SCRIPT FOR OIBRS DATA 

Uses Census Geocoder and Google Maps Geocoder to convert addresses into mappable coordinates

'''

DOI = "doi:10.5072/FK2/JGT4GH"
API_TOKEN = "ac71d785-30b7-4fd0-9c16-6cf118783533"
BASE_URL = "https://datacommons.tdai.osu.edu"
datasets = ["Jackson", "Scioto"]
CENSUS_GEOCODER_BASE_URL = "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address="
CENSUS_GEOCODER_FINAL_URL = "&benchmark=2020&format=json&key=cb140d7e96af88d7b4fb23a669a7c206ee06709f"
GOOGLEMAPS_GEOCODER_BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json?address="
GOOGLEMAPS_GEOCODER_FINAL_URL = "&key=AIzaSyA5x5Pughiwqp2pTSfJ2iEPVhF33a172e4"

api = NativeApi(BASE_URL, API_TOKEN)
data_api = DataAccessApi(BASE_URL, API_TOKEN)
anchor_latlng = [38.963592, -82.815316]

def has_numbers(inputString):
    return any(char.isdigit() for char in inputString)

def googlemaps_geocoder(address):
    url_encoded = urllib.parse.quote(address)
    queryURL = GOOGLEMAPS_GEOCODER_BASE_URL+url_encoded+GOOGLEMAPS_GEOCODER_FINAL_URL
    request_data = requests.get(queryURL).content
    request_data_json = json.loads(request_data)
    results = request_data_json["results"]
    if len(results) < 1:
        return 0
    else:
        return(results[0]["geometry"]["location"])

def census_geocoder(address):
    #print(address)
    url_encoded = urllib.parse.quote(address)
    queryURL = CENSUS_GEOCODER_BASE_URL+url_encoded+CENSUS_GEOCODER_FINAL_URL
    request_data = requests.get(queryURL).content
    request_data_json = json.loads(request_data)
    results = request_data_json["result"]["addressMatches"]
    if len(results) < 1:
        return 0
    else:
        return(results[0]["coordinates"])


def df_to_geojson(jackson_data, name):
    addresses_checked = {}
    jackson_geojson  = {"type": "FeatureCollection", "features": []}
    head = jackson_data.keys()
    for row in jackson_data.itertuples():
        address1 = str(row[5])
        print("A1 "+address1)
        address2 = str(row[6])
        print("A2 "+address2)
        city = str(row[7])
        zip = row[8]
        if not pd.isna(zip):
            zip = str(int(row[8]))
        else:
            zip = str(0)
        if address1 and has_numbers(address1[0:7]) and not pd.isna(address1):
            #address1 = ""
            final_geocode_address = address1 + ", " + city + ", " + "OH, " + zip
        elif address2 and has_numbers(address2[0:7]) and not pd.isna(address2):
            #address2 = ""
            final_geocode_address = address2 + ", " + city + ", " + "OH, " + zip
        else:   
            final_geocode_address = address1 + ", " + address2 + ", " + city + ", " + "OH, " + zip
        geocode_address = final_geocode_address
        final_geocode_address = geocode_address.lower().replace("and", "&").replace("@", "&").replace("nan,", "")
        if final_geocode_address not in addresses_checked.keys():
            #census_geocoder(final_geocode_address)
            res = census_geocoder(final_geocode_address)
            if not res:
                res = googlemaps_geocoder(final_geocode_address)
                if not res:
                    print(final_geocode_address)
                    lat = 0
                    lng = 0
                    #addresses_checked[final_geocode_address] = {"coordinates":[lat, lng], "data":[row[:5].append(row[9:])]}
                    feature = {"type": "Feature", "geometry": {"type": "Point", "coordinates": [lng, lat]}, "properties": {head[index]: str(row[index+1]) for index in range (0, len(row) - 1)}}
                    addresses_checked[final_geocode_address] = [lat, lng]
                else:

                    #addresses_checked[final_geocode_address] = {"coordinates":[res["lat"], res["lng"]], "data":[row[:5].append(row[9:])]}
                    feature = {"type": "Feature", "geometry": {"type": "Point", "coordinates": [res["lat"], res["lng"]]}, "properties": {head[index]: str(row[index+1]) for index in range (0, len(row) - 1)}}

            else:
                latlng = [res["y"], res["x"]]
                #addresses_checked[final_geocode_address] = {"coordinates":[res[1], res[0]], "data":[row[:5].append(row[9:])]}
                feature = {"type": "Feature", "geometry": {"type": "Point", "coordinates": [latlng[1], latlng[0]]}, "properties": {head[index]: str(row[index+1]) for index in range (0, len(row) - 1)}}

                    
        else:
            #addresses_checked["final_geocode_address"]["data"].append(row[:5].append(row[9:]))
            feature = {"type": "Feature", "geometry": {"type": "Point", "coordinates": [latlng[1], latlng[0]]}, "properties": {head[index]: str(row[index+1]) for index in range (0, len(row) - 1)}}
        jackson_geojson["features"].append(feature)
    with open(name+'.geojson', 'w+') as fp:
        json.dump(jackson_geojson, fp)
'''
        
    feature = {"type": "Feature", "geometry": {"type": "Point", "coordinates": [latlng[1], latlng[0]]}, "properties": {head[index]: str(row[index+1]) for index in range (0, len(row) - 1}}
    
 
'''        

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





    


    







