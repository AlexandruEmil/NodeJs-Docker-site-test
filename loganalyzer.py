file=open(r'D:\nodejs-docker-app/LogA')

request_list=file.readlines()


response_codes_list = []
for request in request_list:
    if int(request.split(" ")[8]) > 399 and  int(request.split(" ")[8]) < 500: 
        response_codes_list.append(request.split(" ")[10])

for i in range(0, len(response_codes_list)):
    if(response_codes_list[i] == '"-"'):
        response_codes_list[i] = 'https://localhost:8080/'


unique_codes_list = set(response_codes_list)

print("List with URLs for 4xx responses: ")
print(response_codes_list)

print("Unique codes list: ")
print(unique_codes_list)