import React, { Component } from 'react';
import {
	View,
	Text,
	Platform,
	PickerIOS,
	StyleSheet,
	AsyncStorage,
	Modal,
	TouchableOpacity,
	Button
} from 'react-native';

import PickerAndroid from 'react-native-picker-android';

let Picker = PickerAndroid;
let PickerItem = Picker.Item;
var Dimensions = require('Dimensions');
var ScreenWidth = Dimensions.get('window').width;
var cityEntity = new Object();
var CITY_URL = 'http://121.42.238.246:8080/unitrip_bookstore/bookstore/city_list';
import NetUitl from '../utils/netUitl';
import LoadView from '../view/loading';
export default class CityPickers extends Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			city: 1,
			cityIndex: 1,
			privince_data: {},
			isLoading: true,
			modelIndex: 0,
			show: false,
			visible: this.props.visible,


		}

	}
	// 数据请求 
	fetchCityData(url) {
		var that = this;
		NetUitl.post(url, '', '', function (responseData) {
			//下面的就是请求来的数据
			if (null != responseData && responseData.return_code == '0') {
				that.saveCityData(responseData.list);
				that.setState({
					show: false
				});
			} else {
				that.setState({
					show: false
				});

			}
		})
	}

	/**
	 * 获取城市信息
	 */
	getCityData() {
		var that = this;

		AsyncStorage.getItem(
			'city_list',
			(error, result) => {
				if (error) {
					alert('取值失败:' + error);
				} else {
					const jsonValue = JSON.parse(result);

					if (null != jsonValue) {

						that.setState({
							privince_data: jsonValue[0].province,
							isLoading: false,
							show: false
						})

					} else {
						that.fetchCityData(CITY_URL);

					}

				}
			}
		)
	}

	//保存城市信息
	saveCityData(jsonValue) {
		var that = this;

		AsyncStorage.setItem(
			'city_list',
			JSON.stringify(jsonValue),
			(error) => {
				if (error) {
					alert('存值失败:', error);
				} else {

					that.setState({
						privince_data: jsonValue[0].province,
						isLoading: false,
					})
				}
			}
		);
	}
	close = () => {
		// this.setState({ visible: false });
		// this.props.navigator.pop(
		// 	{

		// 	}
		// );
	}
	dismiss = () => {
		this.setState({ visible: false });
	}
	passMenthod = () => {
		return cityEntity;
	}
	componentWillReceiveProps(props) {
		this.setState({ visible: props.visible });
	}
	componentWillMount() {

		this.getCityData();
	}

	_renderItem() {

		if (!this.state.isLoading) {
			let provincelist = this.state.privince_data;
			let citylist = provincelist[this.state.city].citys;
			cityEntity.provinceid = provincelist[this.state.city].area_id;
			cityEntity.province = provincelist[this.state.city].area_name;
			cityEntity.cityid = citylist[this.state.modelIndex].area_id;
			cityEntity.city = citylist[this.state.modelIndex].area_name;
			// console.log(cityEntity.provinceid, cityEntity.province, cityEntity.cityid, cityEntity.city);
			return <View style={styles.background}>
				<Picker
					pickerStyle={styles.picker_style}
					selectedValue={this.state.city}
					itemStyle={styles.item_txt}
					onValueChange={(city) => this.setState({ city, modelIndex: 0 })}>
					{Object.keys(provincelist).map((city) => (

						<PickerItem
							key={city}
							value={city}
							label={provincelist[city].area_name}
						/>

					))}
				</Picker>

				<Picker
					pickerStyle={styles.picker_style2}
					selectedValue={this.state.modelIndex}
					key={this.state.city}
					itemStyle={styles.item_txt}
					onValueChange={(modelIndex) => this.setState({ modelIndex })}>
					{citylist.map((modelName, modelIndex) => (
						<PickerItem
							key={this.state.city + '_' + modelIndex}
							value={modelIndex}
							label={citylist[modelIndex].area_name}
						/>
					))}
				</Picker>
			</View>
		}
	}

	createButon() {
		return <View style={{ backgroundColor: '#f6f6f6', flexDirection: 'column', height: 45, alignItems: 'center', width: ScreenWidth, }}>

			<View style={{ alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
				<View style={{ height: 1, backgroundColor: '#e2e2e2', margin: 5, width: ScreenWidth }}></View>
				<Text onPress={() => this.props.callbackParent()}
					style={{ textAlign: 'center', width: ScreenWidth, backgroundColor: '#028CE5', color: 'white', paddingTop: 8, paddingBottom: 8 }} >确认</Text>

			</View>
		</View>

	}
	render() {
		return (
			<View style={styles.page}>
				<Modal
					animationType='slide'//进场动画 fade  
					onRequestClose={() => this.close()}
					visible={this.state.visible}//是否可见  
					transparent={true} //背景透明  
				>
					<TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={this.close}//点击灰色区域消失  
					>
						<View style={styles.container} >
							{this._renderItem()}
							{this.createButon()}
						</View>
					</TouchableOpacity>
				</Modal>


			</View>
		);
	}
};
const styles = StyleSheet.create({

	page: {
		height: 230,
		// backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	item_txt: {

		fontSize: 16,
		color: '#666666'
	},
	picker_style: {
		height: 230,
		width: 60,
		backgroundColor: '#f6f6f6'
	}, picker_style1: {
		height: 230,
		width: 60,
		backgroundColor: '#f6f6f6'
	}, picker_style2: {
		height: 230,
		width: 60,
		backgroundColor: '#f6f6f6'
	},
	container: {
		flexDirection: 'column',
		flex: 1,
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		justifyContent: 'center',
		alignItems: 'center',
		width: ScreenWidth,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	}, background: {
		flexDirection: 'row',
		flex: 1,
		alignItems: 'flex-end',
	}
});