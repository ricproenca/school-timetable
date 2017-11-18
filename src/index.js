import TeachersXMLFile from '../fet/inputs/teachers.xml';
import Parser from './js/helpers/xmlParser';

console.log('*** SCHOOL TIMETABLE *** ');

const jsonTeachersJSON = Parser.parseXmlTeachers(TeachersXMLFile);
console.log(jsonTeachersJSON);
