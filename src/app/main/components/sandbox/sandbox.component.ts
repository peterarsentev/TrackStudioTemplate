import { Component, OnInit } from '@angular/core';
import {RateModel} from '../../../shared/models/rate.model';

declare var CodeMirror: any;


@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.scss']
})
export class SandboxComponent implements OnInit {
  code: any;
  output: any;

  constructor() { }

  ngOnInit() {
    this.code = CodeMirror.fromTextArea(document.getElementById("code"), {
      lineNumbers: true,
      matchBrackets: true,
      mode: "text/x-java"
    });
    this.output = CodeMirror.fromTextArea(document.getElementById("output"), {
      lineNumbers: true,
      matchBrackets: true,
      mode: "text/x-java"
    });
    this.code.getDoc().setValue(
      'package ru.job4j.array;\n' +
      '\n' +
      'public class Defragment {\n' +
      '    public static void main(String[] args) {\n' +
      '        System.out.print("Hello, Job4j. I am a Java developer.");\n' +
      '    }\n' +
      '}');
  }

  run() {
    console.log(this.code.getValue());
    this.output.getDoc().setValue('Hello, Job4j. I am a Java developer.');
  }
}
