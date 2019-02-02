import requests, json, smtplib
from bs4 import BeautifulSoup
url = "https://www.rottentomatoes.com/browse/opening/"
r = requests.get(url)
soup = BeautifulSoup(r.text, 'html.parser')
script_tags = soup.find_all("script", src = None, class_ = None, type = None)

#finds the script tag that contains the json with the movie info for new movies this week
#also cleans up the json by removing unnecessary whitespace and commas
for tag in script_tags:
        if "synopsis" in tag.text:
                movie_data = tag.text
movie_data = movie_data.split("\n")
movie_data = movie_data[16].strip()
movie_data = movie_data[:-1]

#decorator that removes emphasis tags from the output of the extract_movie_info function
def remove_em_tags(func):
        def inner_func(json_object):
                output = func(json_object)
                output = output.replace("<em>","")
                output = output.replace("</em>","")
                return output
        return inner_func

#extracts the relevant film information from the json scraped from Rotten Tomatoes
#returns it in a clean fashion
@remove_em_tags
def extract_movie_info(json_object):
        if "title" in json_object.keys():
                title = json_object["title"]
        else:
                title = None
        
        if "tomatoScore" in json_object.keys() and type(json_object["tomatoScore"]) == int:
                score = str(json_object["tomatoScore"]) + "%"
        else:
                score = "No Score Yet"
        
        if "synopsisType" in json_object.keys():
                synopsisType = json_object["synopsisType"] + ":"
        else:
                synopsisType = ""
        
        if "synopsis" in json_object.keys():
                synopsis = json_object["synopsis"]
        else:
                synopsis = ""
        
        if "theaterReleaseDate" in json_object.keys():
                releaseDate = json_object["theaterReleaseDate"]
        else:
                releaseDate = "No Release Date Yet"
        
        return f"""{title}
{score}
{synopsisType} {synopsis}
Release Date: {releaseDate}"""

message_to_send = ""

#loads the json string into a json object
# runs the extract_movie_info function to obtain the relevant movie information from each json object
#and adds it to the message that will be sent by email
movie_json = json.loads(movie_data)
for json_object in movie_json:
        message_to_send += (str(extract_movie_info(json_object)) + "\n" + "\n")
message_to_send = message_to_send.encode(encoding="UTF-8")
print(message_to_send)
#starts secure SMTP connection and sends plain text email through gmail
server = smtplib.SMTP("smtp.gmail.com",587)
server.ehlo()
server.starttls()
server.login("get.movie.info123@gmail.com","qwertyuiop1!")
server.sendmail("get.movie.info123@gmail.com","abe21412@gmail.com",message_to_send)
server.quit()