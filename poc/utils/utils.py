import re

def find_between_strings(text, string_start, string_end, debug):
    if debug == 1:
        print('-------------')
        print('START debug function find_between_strings')
        print('start : ' + string_start)
        print('end : ' + string_end)
        print('text : ' + text)
        print('END debug function find_between_strings')
        print('-------------')
    
    try:
        result = re.search(re.escape(string_start) + '(.*)' + re.escape(string_end), text)
        return result.group(1)
    except:
        return text
