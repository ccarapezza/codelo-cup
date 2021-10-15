import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  body: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 35,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap"
  },
  id: {
    fontSize: 12,
    textTransform: "uppercase"
  },
  image: {
    width: "150pt",
    height: "150pt",
  },
  muestra:{
    border: "1pt",
    borderColor: "black",
    width: "170pt",
    height: "180pt",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginRight: 5,
  }
});

export default function QrsMuestraPdfDocument({muestras}){
  return(<Document>
    <Page size="A4" style={styles.body} wrap>
      {muestras?.map((muestra)=>{
        return(<View style={styles.muestra}>
          <Image
            style={styles.image}
            src={muestra.qrHash}
          />
          <Text style={styles.id}>{"#"+muestra.id}</Text>
        </View>);
      })}
    </Page>
  </Document>);
}