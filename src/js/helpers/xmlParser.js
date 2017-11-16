import cleanXMl from './xmlCleaner';

const ATTRKEY = '$';

class XmlParser {
  static parseTeachers(data) {
    this.isParsing = true;

    const teachers = cleanXMl(data.teachers_timetable, ATTRKEY);
    console.log('XmlParser->parseTeachers - raw data:', data);
    console.log('XmlParser->parseTeachers - clean xml:', teachers);

    this.isParsing = false;
    return teachers;
  }

  static parseRooms(data) {
    this.isParsing = true;

    console.log('XmlParser->parseRooms - raw data:', data);

    this.isParsing = false;
  }
}

export default XmlParser;
