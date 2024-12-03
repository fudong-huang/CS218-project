import pickle

# Load the object back from the file
with open("my_object.pkl", "rb") as file:  # Open file in binary read mode
    loaded_obj = pickle.load(file)

print(loaded_obj[0].to_dict()['message']['content'])
