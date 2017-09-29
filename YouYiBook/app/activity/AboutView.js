import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Dimensions,
    Image,
    StatusBar,
    TouchableOpacity,
    Linking,
} from 'react-native';
var { height, width } = Dimensions.get('window');
import PublicTitle from '../activity/book_public_title';
const BACKICON = require('../img/btn_titel_back.png');
import { toastShort } from '../utils/ToastUtil';
export default class AboutActivity extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        // 这里面的属性和App.js的navigationOptions是一样的。
        header: null,
    });
    constructor(props) {
        super(props);
        this.state = {
            isPdfDownload: false,
        };

    }

    componentDidMount() {

    }

    finishOnlcik = () => {

    }
    backOnclik = () => {
        const { goBack } = this.props.navigation;
        goBack();
    }
    callPhone(phoneNum) {

        var url = 'tel:' + phoneNum;
        // 判断 手机是否支持 url  
        Linking.openURL(url).catch(err => console.error('An error occurred', err));
    }

    render() {

        return (
            <View style={styles.pdfcontainer}>
                < StatusBar
                    animated={true}
                    hidden={false}
                    backgroundColor={'#F3F3F3'}
                    barStyle={'default'}
                    networkActivityIndicatorVisible={true}
                />
                <PublicTitle _backOnclick={() => this.backOnclik()} _finishOnlcik={() => this.finishOnlcik()} title='关于我们' finishIcon={null} leftIcon={BACKICON} />
                <View style={{ height: 1, width: width, backgroundColor: '#1CA831' }} />
                <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <Image style={{ width: 107, height: 67 }} source={require('../img/about_logo.png')} />
                    <Text>版本:V1.0.0</Text>
                </View>
                <Text style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 10 }}>“游逸天下”是山东友谊出版社精心打造的基于手机的移动应用。依托后台准确、丰富的内容资源库，为用户提供景区实时、贴身导游与相关旅游服务，同时实现了国内唯一的在线旅游图书电子商务平台。该商务平台整合了中国旅游图书发行联合体成员单位的旅游图书资源，为用户提供图书的在线预览和下单购买、电子书在线下载、实体书线下配送的全方位图书消费服务。“游逸天下”将致力于打造国内旅游信息最准确、最丰富的综合性旅游移动应用，该应用内所有内容未经山东友谊出版社许可，不得任意转载，山东友谊出版社保留追究法律责任的权利。</Text>
                <Text style={{ paddingLeft: 10 }}>客服电话：400-820-8888</Text>
                <Text style={{ paddingLeft: 10, paddingTop: 10, color: '#000000',fontSize:15 }}>版权声明</Text>
                <Text style={{ paddingLeft: 10,paddingRight:10}}>软件内置图书有山东出版集团正版授权，如有疑问，请联系我们。</Text>
                <TouchableOpacity activeOpacity={0.8} onPress={() => this.callPhone('010-57853258')}>
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <Image style={{ width: 264, height: 40 }} source={require('../img/call_btn.png')} />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});