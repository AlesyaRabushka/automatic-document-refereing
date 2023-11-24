import {Document, StyleSheet, Page, View, Text, Font, } from "@react-pdf/renderer";


Font.register({
  family: "Roboto",
  fonts:[
  { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf", fontWeight: 300}
 ]
});


const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fcf8fd'
  },
  section: {
    margin: 10,
    padding: 10,
    textAlign: 'left',
    fontFamily: 'Roboto',
    fontWeight:100,
  },
  title:{
    margin: 10,
    padding: 10,
    textAlign: 'center',
    fontFamily: 'Roboto',
    fontWeight:300,
  }
});

interface propsPDF{
  keyWords: string,
  sentences: string,
  summary: string,
}

const PDF = ({props}:{props:propsPDF}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.title}>
          <Text>Ключевые слова и фразы:</Text>
        </View>
        <View style={styles.section}>
          <Text>{props.keyWords}</Text>
        </View>
        <View style={styles.title}>
            <Text>Информативные предложения:</Text>
        </View>
        <View style={styles.section}>
          <Text>{props.sentences}</Text>
        </View>
        <View style={styles.title}>
            <Text>ML метод:</Text>
        </View>
        <View style={styles.section}>
          <Text>{props.summary}</Text>
        </View>
      </Page>
    </Document>
  )
}

export default PDF;