

import React, { Component } from 'react';
export default class StringBufferUtil extends React.Component {

  static  init() {
        this.__strings__ = new Array;
    }

    static append(str) {
        this.__strings__.push(str);
    };

    static toString() {
        return this.__strings__.join("");
    };


}
