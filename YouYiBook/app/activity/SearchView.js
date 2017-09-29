import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    Image,
    TouchableOpacity,
    StatusBar,
    AsyncStorage,
    ScrollView,
    Dimensions,
    Platform
} from 'react-native';
var { height, width } = Dimensions.get('window');
import NetUitl from '../utils/netUitl';
import StringBufferUtils from '../utils/StringBufferUtil';
const SEARCHICON = require('../img/search_btn.png');
const CANCLEICON = require('../img/btn_title_cancel.png');
const CLEARICON = require('../img/btn_clearhistory.png');
var classifies = [];
const HISTORY_KEY = 'search_history';
var historyList = [];
import DeviceStorage from '../utils/deviceStorage';
export default class SearchActivity extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        // 这里面的属性和App.js的navigationOptions是一样的。
        header: null,
    });
    constructor(props) {
        super(props);
        this.state = {
            keyWord: '',
            history: [],


        };

    }

    // componentDidMount() {
    //     this.getData();

    // }
    // 判断是否在数组中
    historyExist(searchWord) {
        var isExist = false;

        if (classifies.length > 0) {

            for (var i = 0; i < classifies.length; i++) {

                if (classifies[i] == searchWord) {

                    isExist = true;

                }



            }


        } else {

            isExist = false;

        }


        return isExist;

    }
    backOnclik = () => {
        const { goBack } = this.props.navigation;
        goBack();
    }
    hotWordClick(hotword) {
        if (this.historyExist(hotword)) {

        } else {

            var historyObj = new Object();
            historyObj.key = hotword;
            historyObj.value = hotword;
            historyList.push(historyObj);
            // var json = JSON.stringify(historyList);
            this.saveHistoryData(historyList);
        }

        this._goSearchResult(null, hotword, false)


    }

    // 清除搜索历史
    clearBtn() {

        var str = '';
        AsyncStorage.removeItem(
            HISTORY_KEY,
            (error) => {
                if (!error) {
                    var strs = [];
                    this.setState({

                        history: strs,
                        keyWord: ''

                    })
                }
            }
        )



    }
    componentDidMount() {
        this.getHistoryValue();

    }

    // 存储历史数据
    saveHistoryData(value) {
        //appHotSearchTagList就是当时保存的时候所保存的key，而tags就是保存的值
        DeviceStorage.save(HISTORY_KEY, value);
    }
    //获取历史数据
    getHistoryValue() {
        var that = this;
        DeviceStorage.get(HISTORY_KEY, function (jsonValue) {
            if (null != jsonValue && jsonValue.length > 0) {

                historyList = jsonValue;
                that.setState({
                    history: historyList
                });
                console.log(historyList.length);
            }


        });

    }
    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#e2e2e2' }} />;
    }
    _submitBtn() {

        this.hotWordClick(this.state.keyWord)
    }
    _cancleBtn = () => {

    }
    _goSearchResult = (itemData, keyWord, isSearch) => {
        const { navigate } = this.props.navigation;
        if (isSearch) {


            navigate('searchResultView', {
                keyword: itemData.item.value
            });


        } else {

            navigate('searchResultView', {
                keyword: keyWord
            });

        }
    }

    // 返回历史记录Item
    _renderHistoryItem = (itemData) => {
        console.log(itemData);
        return (
            <View style={{ height: 45, justifyContent: 'center', backgroundColor: '#ffffff' }}>
                <TouchableOpacity onPress={() => this._goSearchResult(itemData, '', true)} activeOpacity={0.8}>
                    <View style={{ height: 45, flexDirection: 'column', justifyContent: 'center' }}>
                        <Text style={styles.rule_item_title}>{itemData.item.value}</Text>

                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    renderIosBar() {

        if (Platform.OS) {

            return <View style={{height: 20, backgroundColor: '#f6f6f6',}}></View>
        }

    }
    render() {

        return (
            <View style={styles.page}>
                <StatusBar
                    animated={true}
                    hidden={false}
                    backgroundColor={'#E1E7E3'}
                    barStyle={'default'}
                    networkActivityIndicatorVisible={true}
                />

                <View>
                    {this.renderIosBar()}
                    <View style={styles.top_layout}>
                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', height: 36, width: width, backgroundColor: '#E1E7E3' }}>

                                <TextInput style={{
                                    width: width - 80, height: 30, backgroundColor: 'white',  marginLeft: 20,
                                    borderRadius: 15, borderWidth: 1, borderColor: '#00B11D',padding:0,paddingLeft:35
                                }} onChangeText={(keyWord) => this.setState({ keyWord })}
                                           value={this.state.keyWord} placeholderTextColor='#999999' returnKeyType='search'
                                           underlineColorAndroid='transparent' placeholder=' 搜索书名、作者、出版社等' onSubmitEditing={() => { this._submitBtn() }}>
                                </TextInput>
                                <Image style={{ width: 20, height: 20, marginLeft: 30, position: 'absolute' }} source={SEARCHICON} />
                                <View style={{
                                    height: 36, width: 50, justifyContent: 'center',

                                }}>

                                    <TouchableOpacity activeOpacity={0.8} onPress={() => this.backOnclik()}>
                                        <Image style={{ width: 39, height: 30, marginLeft: 10, marginRight: 10 }} source={CANCLEICON}></Image>
                                    </TouchableOpacity>

                                </View>

                            </View>
                            <View style={{ height: 1, width: width, backgroundColor: '#1CA831' }} />
                        </View>
                    </View>

                </View>

                <ScrollView>
                    <View style={{ flex: 1 }}>


                        <FlatList
                            style={{ backgroundColor: '#ffffff' }}
                            ref={(flatList) => this.historyList = flatList}
                            ItemSeparatorComponent={this._separator}
                            renderItem={this._renderHistoryItem}
                            data={this.state.history}>
                        </FlatList>
                        <View style={{ height: 1, backgroundColor: '#e2e2e2' }}></View>
                        <View style={{ flexDirection: 'row', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => this.clearBtn()} activeOpacity={0.8}>
                                <View style={{ height: 40, alignItems: 'center', flexDirection: 'row' }}>

                                    <Image style={{ width: 161, height: 30 }} source={CLEARICON}></Image>

                                </View>
                            </TouchableOpacity>

                        </View>

                    </View>

                </ScrollView>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#f6f6f6'

    }, top_layout: {
        height:45,
        flexDirection: 'row',
        alignItems: 'center'


    },
    left_icon: {
        width: 28,
        height: 28,
        marginLeft: 10,
        justifyContent: 'center'

    }, left_view: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: 30
    }, rule_item_title: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: 20,
        fontSize: 14,
        color: '#000000',
        marginTop: 5
    },
});