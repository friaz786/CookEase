from flask import Flask, jsonify, request
import re
from spellchecker import SpellChecker
import pandas as pd
from PIL import Image
import pytesseract as tess
import pandas as pd
from transformers import AutoImageProcessor, AutoModelForImageClassification
import requests
import torch


app = Flask(__name__)


@app.route('/test', methods = ['GET'])
def test():
    data = {'message': 'successful'}
    return jsonify(data)


tess.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
@app.route('/check', methods = ['POST'])
def check():
    file = request.files['image']
    img = Image.open(file) #pillow library opens the image
    text = tess.image_to_string(img)
    
    # Define a pattern to match E codes
    pattern = r'\bE\d+\b'

    # Read the CSV file using pandas
    df = pd.read_csv('codes.csv')

    # Extract codes from the paragraph
    e_codes = re.findall(pattern, text)

    # Initialize a flag to check if any Haraam products are found
    haraam_found = False

    # Iterate over the codes
    for code in e_codes:
        # Check if the code is present in the CSV file
        if code in df['Codes'].values:
            # Check if the reason contains "Haraam" or "Mushbooh"
            reason = df.loc[df['Codes'] == code, 'Reasons'].values[0]
            if 'Haraam' in reason or 'Mushbooh' in reason:
                haraam_found = True
                data = {'message' : 'unsucessfull', 'ingredient' : code, 'reason': reason}
                return jsonify(data)
                

    # If no Haraam products are found, print a message
    if not haraam_found:
        print("It does not contain Haraam products.")


    # Remove extra round brackets and codes like E110, E124, etc.
    clean_text = re.sub(r'\([^)]*\)', '', text)  # Remove anything within parentheses
    clean_text = re.sub(r'E\d+', '', clean_text)  # Remove codes like E110, E124, etc.

    # Split the ingredients into an array based on comma
    ingredients_array = [ingredient.strip() for ingredient in clean_text.split(',')]

    # Remove non-alphanumeric characters and newlines from each ingredient
    ingredients_array = [re.sub(r'[^a-zA-Z0-9\s]', '', ingredient) for ingredient in ingredients_array]
    ingredients_array = [re.sub(r'\n', '', ingredient) for ingredient in ingredients_array]

    # Remove empty elements
    ingredients_array = [ingredient for ingredient in ingredients_array if ingredient]

    # Initialize spellchecker
    spell = SpellChecker()

    # Split each ingredient into individual words
    split_ingredients = []
    for ingredient in ingredients_array:
        split_words = ingredient.split()
        split_ingredients.extend(split_words)

    # Replace non-English words with the closest English word, or remove them if no similar word is found
    for i in range(len(split_ingredients)):
        word = split_ingredients[i].lower()  # Convert word to lowercase
        corrected_word = spell.correction(word)
        if corrected_word != word:
            split_ingredients[i] = corrected_word
        else:
            split_ingredients[i] = word

    # Remove empty elements
    split_ingredients = [ingredient for ingredient in split_ingredients if ingredient]

    # Remove words like "and"
    split_ingredients = [ingredient for ingredient in split_ingredients if ingredient.lower() != 'and']   

    print(split_ingredients)

    df = pd.read_csv('Haram Ingredients.csv')

    # Initialize variables to store matched ingredient and its reason
    matched_ingredient = None
    matched_reason = None

    # Check if any ingredient from split_ingredients is present in df['ingredients']
    for ingredient in split_ingredients:
        matches = df[df['Ingredients'].str.contains(ingredient, case=False, na=False)]
        if not matches.empty:
            # Get the first matched ingredient and its reason
            matched_ingredient = ingredient
            matched_reason = matches['Reason'].iloc[0]
            # Break the loop as soon as a match is found
            break

    if matched_ingredient is not None:
        print("Matched Ingredient:", matched_ingredient)
        print("Reason:", matched_reason)
        data = {'message' : 'unsucessfull', 'ingredient' : matched_ingredient, 'reason': matched_reason}
        return jsonify(data)
    else:
        print("No matching ingredient found.")
        data = {'message': 'successfull'}
        return jsonify(data)
    

# Load the model and processor
processor = AutoImageProcessor.from_pretrained("jazzmacedo/fruits-and-vegetables-detector-36")
model = AutoModelForImageClassification.from_pretrained("jazzmacedo/fruits-and-vegetables-detector-36")    


@app.route('/detect_fruits_vegetables', methods=['POST'])
def detect_fruits_vegetables():
    file = request.files['image']
    image = Image.open(file.stream)  # Open the image file directly from the request file stream

    # Preprocess the image
    inputs = processor(images=image, return_tensors="pt")

    # Make predictions
    outputs = model(**inputs)

    # Process the model's outputs
    logits = outputs.logits
    results = logits.softmax(dim=-1)

    # Get the top predictions
    top_results = results.topk(k=5)  # Adjust 'k' for more or fewer results

    predictions = []
    for score, idx in zip(top_results.values[0], top_results.indices[0]):
        label = model.config.id2label[idx.item()]
        confidence = score.item()
        #predictions.append(f"{label}: {confidence:.4f}")
        predictions.append(f"{label}: {confidence:.4f}")

    return jsonify({"predictions": predictions})


if __name__ == '__main__':
    app.run(host='192.168.1.65', port=5000, debug=True)