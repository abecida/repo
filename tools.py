all = []

while True:
    print('Getting Input')
    string = input()
    if string == 'q': break
    all.append(string)

i = 0
while(i < len(all)):
    print('node_modules/'+all[i]);
    i += 1;