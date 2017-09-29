import React, { Component } from 'react';
import {
    AppRegistry,
    ListView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    View,
    StatusBar,
    Image,
    InteractionManager,
    FlatList,
    Dimensions,

} from 'react-native';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import LoadView from '../view/loading';
import NetUitl from '../utils/netUitl';
var { height, width } = Dimensions.get('window');
import StringBufferUtils from '../utils/StringBufferUtil';
var BASEURL = 'http://121.42.238.246:8080/unitrip_bookstore/bookstore/app_recommend';
import Global from '../utils/global';
import StringUtil from '../utils/StringUtil';
// var RETURN_ICON = require('./images/tabs/icon_return.png');
import DeviceStorage from '../utils/deviceStorage';
import { CachedImage } from "react-native-img-cache";
import { toastShort } from '../utils/ToastUtil';
import RNFS from 'react-native-fs';
var navigate = null;
export default class RecommendAppActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            appList: []

        };
    }

    componentDidMount() {
        var that = this;
        navigate = this.props.navigation;
        this.getData();
    }
    componentWillUnmount() {
    }

    getData() {
        this.setState({
            show: true
        });
        StringBufferUtils.init();
        StringBufferUtils.append('page=' + '0');
        StringBufferUtils.append('&&count=' + 100);
        StringBufferUtils.append('&&type=' + 'android');
        let params = StringBufferUtils.toString();
        this.fetchData(params);
    }
    // 数据请求
    fetchData(params) {
        var that = this;
        console.log(BASEURL + params);
        NetUitl.post(BASEURL, params, '', function (responseData) {
            //下面的就是请求来的数据
            if (null != responseData && responseData.return_code == '0') {

                that.addItemKey(responseData.apps);
                that.setState({
                    show: false

                })

            } else {
                that.setState({
                    show: false
                });

            }
        })
    }

    //整合数据
    addItemKey(rulelist) {
        var that = this;
        if (null != rulelist && rulelist.length > 0) {

            //整合法规数据

            for (var i = 0; i < rulelist.length; i++) {
                rulelist[i].key = i;

            }



            that.setState({
                appList: rulelist,
                show: false
            });


        } else {
            that.setState({
                show: false,
            });
        }


    }

    _backOnclick() {
        this.props.navigator.pop(
            {

            }
        );

    }


    //点击列表点击每一行
    clickItem(item) {
        var that = this;


        // DeviceStorage.get(item.book_id + '.pdf', function (jsonValue) {
        //     if (jsonValue != null) {

        //         var isDownLoad = jsonValue.isDownLoad;
        //         if (!isDownLoad) {
        //             that._downLoadMethord(item);
        //         } else {

        //             navigate('PdfReadView', {
        //                 book_id: item.book_id
        //             });

        //         }
        //     } else {
        //         that._downLoadMethord(item);

        //     }



        // });




    }

    _downLoadMethord(item) {
        var that = this;
        that.setState({
            show: true,
        });
        var DownloadFileOptions = {
            fromUrl: item.freeread_url,          // URL to download file from
            toFile: RNFS.DocumentDirectoryPath + '/' + item.book_id + '.pdf', // Local filesystem path to save the file to
            begin: function (val) {
                toastShort('下载开始');
            },
            progress: function (val) {
                tempLength = parseInt(val.bytesWritten);
                totalSize = parseInt(val.contentLength);
                percents = (tempLength / totalSize).toFixed(2);
                if ((percents * 100) > 99) {
                    that.setState({
                        show: false
                    });
                    var obj = new Object();
                    obj.isDownLoad = true;
                    toastShort('下载完成');
                    navigate('PdfReadView', {
                        book_id: item.book_id
                    });
                    DeviceStorage.save(item.book_id + '.pdf', obj);
                }
            },
        }
        var result = RNFS.downloadFile(DownloadFileOptions);
    }
    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#e2e2e2' }} />;
    }
    onClickListener(flag, item) {

        switch (flag) {
            case '0'://下载
                alert('下载文件');
                break;

        }

    }


    // 返回国内法规Item
    _renderSearchItem = (itemData, index) => {
        return (
            <View style={{ height: 102, justifyContent: 'center', backgroundColor: 'white' }}>
                <TouchableOpacity onPress={() => this.clickItem(itemData, index)} activeOpacity={0.8}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width, alignItems: 'center' }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <CachedImage style={{ height: 80, width: 60, marginLeft: 10 }} source={{ uri: itemData.item.app_icon }} />
                            <View style={{ height: 100, flexDirection: 'column', justifyContent: 'center', marginLeft: 10 }}>
                                <Text style={styles.news_item_title} numberOfLines={1}>{itemData.item.app_name}</Text>
                                <Text style={styles.rule_item_time}>{itemData.item.app_content}</Text>

                            </View>
                        </View>
                        <View style={{ width: 80, height: 45, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>

                            <TouchableOpacity activeOpacity={0.8} onPress={() => this.onClickListener('0', itemData)}>
                                <View style={{ width: 24, height: 24, alignItems: 'center' }}>
                                    < Image source={require('../img/btn_download.png')} style={{ height: 17, width: 16 }} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ height: 1, backgroundColor: '#e2e2e2', width: width }} />
                </TouchableOpacity>
            </View>
        );
    }

    //此函数用于为给定的item生成一个不重复的key
    _keyExtractor = (item, index) => item.key;
    render() {
        let self = this;
        return (
            <View style={styles.container}>
                {this.state.show == true ? (<LoadView />) : (null)}
                <View style={styles.main_bg}>
                    <FlatList
                        ref={(flatList) => this._flatList = flatList}
                        renderItem={this._renderSearchItem}
                        keyExtractor={this._keyExtractor}
                        data={this.state.appList}
                        extraData={this.state}
                    >
                    </FlatList>

                </View>


            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    standalone: {
        marginTop: 30,
        marginBottom: 30,
    },
    standaloneRowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        justifyContent: 'center',
        height: 50,
    },
    standaloneRowBack: {
        alignItems: 'center',
        backgroundColor: '#8BC645',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15
    },
    backTextWhite: {
        color: '#FFF',
        textAlign: 'center'
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 100,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 80,
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 60,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
        height: 100,
        marginTop: 1,

    },
    controls: {
        alignItems: 'center',
        marginBottom: 30
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 5
    },
    switch: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'black',
        paddingVertical: 10,
        width: 100,
    },
    top_name: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#000000',
        fontSize: 14,
    }, top_select_name: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#ff9602',
        fontSize: 14,
    }, main_bg: {
        backgroundColor: 'white',
        margin: 10,



    }
});
