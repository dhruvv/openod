import flask

from pyDataverse.api import NativeApi, DataAccessApi
from pyDataverse.models import Dataverse

API_TOKEN = "ac71d785-30b7-4fd0-9c16-6cf118783533"
BASE_URL = "https://datacommons.tdai.osu.edu"

api = NativeApi(BASE_URL, API_TOKEN)
data_api = DataAccessApi(BASE_URL, API_TOKEN)

def get_data():
    DOI =  "doi:10.5072/FK2/P9B4YV"
    dataset = api.get_dataset(DOI)

    files_list = dataset.json()['data']['latestVersion']['files']
    geoJsons = []

    for file in files_list:
        filename = file["dataFile"]["filename"]
        file_id = file["dataFile"]["id"]
        print("File name {}, id {}".format(filename, file_id))
        response = data_api.get_datafile(file_id)
        geoJsons.append(response.content)
    return geoJsons

@app.route('/')
def index():
    

