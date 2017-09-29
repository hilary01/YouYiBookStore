/**
 * NetUitl 网络请求的实现
 * https://github.com/facebook/react-native
 */
import React, { Component } from 'react';
import {
} from 'react-native';
import { toastShort } from '../utils/ToastUtil';
export default class NetUitl extends React.Component {


    // constructor(props) {
    //     super(props);
    // NetWorkTool.checkNetworkState((isConnected) => {
    //     if (!isConnected) {
    //         Toast.show(NetWorkTool.NOT_NETWORK);
    //     }
    // });
    // }

    // handleMethod(isConnected) {
    //     alert((isConnected ? 'online' : 'offline'));
    // }
    // componentWillMount() {
    //     NetWorkTool.removeEventListener(NetWorkTool.TAG_NETWORK_CHANGE, this.handleMethod);
    // }

    // componentWillUnmount() {
    //     NetWorkTool.removeEventListener(NetWorkTool.TAG_NETWORK_CHANGE, this.handleMethod);
    // }
    static getFetch(url, params, callback) {
        var str = '';
        if (typeof params === 'object' && params) {
            str += '?';
            Object.keys(params).forEach(function (val) {
                str += val + '=' + encodeURIComponent(params[val]) + '&';
            })
        }

        fetch(url + str, {
            method: 'GET'
        }).then(function (res) {
            res.json().then(function (data) {
                callback(data);
            })
        }, function (e) {
            console.log('请求失败');
        })
    }

    /*
     *  get请求
     *  url:请求地址
     *  data:参数
     *  callback:回调函数
     * */
    static get(url, params, callback) {
        var str = '';
        if (typeof params === 'object' && params) {
            str += '?';
            Object.keys(params).forEach(function (val) {
                str += val + '=' + encodeURIComponent(params[val]) + '&';
            })
        }
        //fetch请求
        alert(url + str);
        fetch(url + str, {
            method: 'GET',
        })
            .then((response) => {
                response.json()
                alert(JSON.stringify(response.text()));
                callback(response.json())
            })
            .catch((err) => {
                toastShort('服务器异常，请稍后再试！');
                callback(err)
            }).done();
    }

    static toQueryString(obj) {
        return obj ? Object.keys(obj).sort().map(function (key) {
            var val = obj[key];
            if (Array.isArray(val)) {
                return val.sort().map(function (val2) {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
                }).join('&');
            }

            return encodeURIComponent(key) + '=' + encodeURIComponent(val);
        }).join('&') : '';
    }

    /*
     *  post请求
     *  url:请求地址
     *  data:参数
     *  callback:回调函数
     * */
    static post(url, params, header, callback) {
        //fetch请求
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        })
            .then((response) => response.json())
            .then((responseJSON) => {
                callback(responseJSON)
            }).catch((err) => {
                toastShort('服务器异常，请稍后再试！');
            }).done();
    }

    static postMtheord(url, params, headers, callback) {
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                //表单
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params,
        })
            .then((response) => response.json())
            .then((responseJSON) => {
                callback(responseJSON)
            }).catch((err) => {
                toastShort('服务器异常，请稍后再试！');
            }).done();
    }

    static uploadImage(url, path, fileName, callback) {
        let formData = new FormData();
        let file = { uri: path, type: 'multipart/form-data', name: fileName };

        formData.append("up", fileName);
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {

                callback(responseData);
            })
            .catch((error) => {
                callback(error);
            }).done();
        ;

    }

    // let params = {'start':'0',limit:'20','isNeedCategory': true, 'lastRefreshTime': '2016-09-25 09:45:12'};
    //     NetUitl.post('http://www.pintasty.cn/home/homedynamic',params,'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJVLTliZGJhNjBjMjZiMDQwZGJiMTMwYWRhYWVlN2FkYTg2IiwiZXhwaXJhdGlvblRpbWUiOjE0NzUxMTg4ODU4NTd9.ImbjXRFYDNYFPtK2_Q2jffb2rc5DhTZSZopHG_DAuNU',function (set) {
    //         //下面的就是请求来的数据
    //         console.log(set)
    //     })
    //     //get请求,以百度为例,没有参数,没有header
    //     NetUitl.get('https://www.baidu.com/','',function (set) {
    //         //下面是请求下来的数据
    //         console.log(set)
    //     })


}
