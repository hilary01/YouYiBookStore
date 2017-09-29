import React, { Component } from 'react';
import {
    AsyncStorage
} from 'react-native';

export default class DeviceStorage extends React.Component {
    /**
     * 获取
     * @param key
     * @returns {Promise<T>|*|Promise.<TResult>}
     */

    static get(key, callBack) {
        return AsyncStorage.getItem(key).then((value) => {
            const jsonValue = JSON.parse(value);
            callBack(jsonValue);
            return value;
        });
    }


    /**
     * 保存
     * @param key
     * @param value
     * @returns {*}
     */
    static save(key, value) {

        return AsyncStorage.setItem(key, JSON.stringify(value)).then((value) => {
            const jsonValue = JSON.parse(value);
            return value;
        });
    }


    /**
     * 更新
     * @param key
     * @param value
     * @returns {Promise<T>|Promise.<TResult>}
     */
    static update(key, value) {
        return DeviceStorage.get(key).then((item) => {
            value = typeof value === 'string' ? value : Object.assign({}, item, value);
            return AsyncStorage.setItem(key, JSON.stringify(value));
        });
    }


    /**
     * 更新
     * @param key
     * @returns {*}
     */
    static delete(key, callBack) {
        AsyncStorage.removeItem(
            key,
            (error) => {
                if (!error) {
                    callBack('0');
                } else {

                    callBack('1');
                }
            }
        )
    }
}
