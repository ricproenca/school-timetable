import TeachersXMLFile from '../fet/inputs/teachers.xml';
import Parser from './js/helpers/xmlParser';

console.log('*** SCHOOL TIMETABLE *** ');

var teachers = Parser.parseTeachers(TeachersXMLFile);
console.log(teachers.teacher[0]);
