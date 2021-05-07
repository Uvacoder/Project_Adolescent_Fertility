import json

with open('./average_peryearandregion.csv') as f:
	lines = f.read().split('\n')[:-1]
	column_names = []
	json_data = []
	for i, line in enumerate(lines):
		if i == 0: # header
			column_names = line.split(',')
		else:
			data = line.split(',')
			sub_data_array = []
			index_count = 0
			for data_value in data:
				if (index_count != 0):
					sub_data_array.append({
						"Region": column_names[index_count],
						"Value": data_value
					})
				index_count = index_count + 1

			json_data.append({
				"Year": data[0],
				"Data": sub_data_array
			})

			with open('average_peryearandregion.json', 'w') as outfile:
				json.dump(json_data, outfile)
			