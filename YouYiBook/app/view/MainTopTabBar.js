import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	Image,
	Dimensions
} from 'react-native';

// import Icon from 'react-native-vector-icons/Ionicons';
const LABLEICON = require('../img/tab_menu_selected.png');
const LABLENOICON = require('../img/null_image.png');
const { width, height } = Dimensions.get('window');
export default class WeixinTabBar extends Component {

	static propTypes = {
		goToPage: React.PropTypes.func, // 跳转到对应tab的方法
		activeTab: React.PropTypes.number, // 当前被选中的tab下标
		tabs: React.PropTypes.array, // 所有tabs集合
		tabNames: React.PropTypes.array, // 保存Tab名称
		tabIconNames: React.PropTypes.array, // 保存Tab图标
		key: React.PropTypes.number
	}

	setAnimationValue({ value }) {
	}

	componentDidMount() {
		// Animated.Value监听范围 [0, tab数量-1]
		this.props.scrollValue.addListener(this.setAnimationValue);
	}

	renderTabOption(tab, i) {
		let color = this.props.activeTab == i ? "#00B11D" : "#666666"; // 判断i是否是当前选中的tab，设置不同的颜色
		let select = this.props.activeTab == i ? true : false;
		return (
			<TouchableOpacity onPress={() => this.props.goToPage(i)} style={styles.tab}>
				<View style={styles.tabItem}>

					<Text style={{ color: color }}>
						{this.props.tabNames[i]}
					</Text>
					{this._renderSelectImage(select)}
				</View>
			</TouchableOpacity>
		);
	}
	_renderSelectImage(select) {
		if (select == true) {

			return <Image style={{ width: width / 4 - 20, height: 8 }}
				source={LABLEICON} />

		} else {

			return <Image style={{ width: width / 4 - 20, height: 8 }}
				source={LABLENOICON} />
		}


	}

	render() {
		return (
			<View>
				<View style={styles.tabs}>
					{this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
				</View>
				<View style={{ height: 2, width: width, backgroundColor: '#00B11D' }} />

			</View>
		);
	}
}

const styles = StyleSheet.create({
	tabs: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		height: 36,
	},

	tab: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},

	tabItem: {
		flexDirection: 'column',
		alignItems: 'center',
	},
});

