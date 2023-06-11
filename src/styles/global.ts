import { StyleSheet } from 'react-native';


// Global stylesheet
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: '#6284E6',
        width: 130,
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center'
    },
    headerStyle: { backgroundColor: '#3346A6' },
    textStatusBar: { color: 'white' },
    containerStatus: {
        flex: 1,
        flexDirection: 'row',
        marginRight: 20,
        marginLeft: 20
    },
});


export default styles;
