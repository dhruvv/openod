from flask import Flask, jsonify, render_template
import json
from pyDataverse.api import NativeApi, DataAccessApi
from pyDataverse.models import Dataverse

app = Flask(__name__)
API_TOKEN = "ac71d785-30b7-4fd0-9c16-6cf118783533"
BASE_URL = "https://datacommons.tdai.osu.edu"

api = NativeApi(BASE_URL, API_TOKEN)
data_api = DataAccessApi(BASE_URL, API_TOKEN)

def get_data(file_wanted):
    DOI =  "doi:10.5072/FK2/P9B4YV"
    dataset = api.get_dataset(DOI)

    files_list = dataset.json()['data']['latestVersion']['files']
    geoJsons = []
    file_wanted = file_wanted + '.geojson'
    for file in files_list:
        filename = file["dataFile"]["filename"]
        if filename == file_wanted:
            file_id = file["dataFile"]["id"]
            print("File name {}, id {}".format(filename, file_id))
            response = data_api.get_datafile(file_id)
            rc = response.content
            geojson = json.loads(rc.decode('utf-8'))
            #print(geojson)
            geojson["type"] = "FeatureCollection"
            return geojson
        # OPTIMIZE THIS THIS IS REALLY BAD
                
    return None


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/<file_id>')
def return_geojson(file_id):
    return jsonify(get_data(file_id))



