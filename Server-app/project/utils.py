import xml.etree.ElementTree as ET
import requests
from io import BytesIO
from zipfile import ZipFile
from django.utils.dateparse import parse_datetime
from django.utils.timezone import is_aware, make_aware
from datetime import datetime


def parse_xml_file(file) -> list:
    """
    Parse a xml file and return list of xml data in dicts

    param file: in memory file
    """
    tree = ET.parse(file)
    root = tree.getroot()

    elements = []
    for elem in root:
        data = {
            one.tag: one.text if one.text is not None else ""
            for one in elem
        }
        elements.append(data)

    return elements


def fetch_and_extract_zip_from_url(url, abs_path) -> str:
    """
    Gets zip from url, extracts it `abs_path` and returns the name of first file
    """
    content = requests.get(url)
    f = ZipFile(BytesIO(content.content))
    f.extractall(path=abs_path, )
    return f.namelist()[0]


def correctly_parse_datetime(date_iso: str) -> datetime:
    """
    Do not raise error if date is not parse able. but rather return
    current time.
    """
    try:
        to_ret = parse_datetime(date_iso)

        if is_aware(to_ret):
            return to_ret
        else:
            return make_aware(to_ret)

    except:
        return make_aware(datetime.now())


def slugs_to_job_urls(slugs: list) -> list:
    return [
        f"https://workire.com/job/{slug}"
        for slug in slugs
    ]
