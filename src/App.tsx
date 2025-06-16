import React, { useEffect, useState } from "react";
import {
  IonApp,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonText,
  setupIonicReact,
  SegmentValue,
  IonAccordionGroup,
  IonAccordion,
} from "@ionic/react";
import "@ionic/react/css/core.css";
import { BASE_URL } from "./lib/costants";
import { Diet, Alimento } from "./models/diet";
import { AlternativeMap, AlternativeItem } from "./models/alternatives";

setupIonicReact();

const App: React.FC = () => {
  const [dieta, setDieta] = useState<Diet>({});
  const getCurrentDay = () => {
    const days = ['domenica', 'lunedi', 'martedi', 'mercoledi', 'giovedi', 'venerdi', 'sabato'];
    return days[new Date().getDay()];
  };
  const [giornoSelezionato, setGiornoSelezionato] = useState<SegmentValue>(getCurrentDay());
  const [errore, setErrore] = useState<string | null>(null);
  const [alternativeMap, setAlternativeMap] = useState<AlternativeMap>({});

  useEffect(() => {
    fetch(`${BASE_URL}/api/diet`)
      .then((res) => {
        if (!res.ok) throw new Error("API non disponibile");
        return res.json();
      })
      .then((data) => {
        setDieta(data);
        const today = getCurrentDay();
        if (data[today]) {
          setGiornoSelezionato(today);
        } else {
          setGiornoSelezionato(Object.keys(data)[0]); // fallback
        }
      })
      .catch((err) => setErrore(err.message));
  }, []);

  const fetchAlternatives = async (codice_alt: string) => {
    if (alternativeMap[codice_alt]) return;
    console.log(codice_alt);
    try {
      const res = await fetch(`${BASE_URL}/api/alternatives?id=${codice_alt}`);
      if (res.ok) {
        const data: AlternativeItem[] = await res.json();
        setAlternativeMap((prev) => ({ ...prev, [codice_alt]: data }));
      }
    } catch (err) {
      console.error("Errore nel recupero alternative:", err);
    }
  };

  const giorniDisponibili = Object.keys(dieta);

  return (
    <IonApp>
      <IonPage className="bg-red-500">
        <IonHeader>
          <IonToolbar>
            <IonTitle className="text-red-500">Easy Diet</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          {errore && <IonText color="danger">Errore: {errore}</IonText>}

          <IonSegment
            value={giornoSelezionato}
            onIonChange={(e) => setGiornoSelezionato(e.detail.value!)}
          >
            {giorniDisponibili.map((g) => (
              <IonSegmentButton key={g} value={g}>
                <IonLabel>{g.charAt(0).toUpperCase() + g.slice(1)}</IonLabel>
              </IonSegmentButton>
            ))}
          </IonSegment>

          {dieta[giornoSelezionato]?.map((pasto, index) => (
            <IonCard key={index}>
              <IonCardHeader>
                <IonCardTitle>{pasto.pasto.toUpperCase()}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {pasto.alimenti.map((alimento: Alimento, idx: number) => (
                  <IonList key={idx}>
                    {alimento.codice_alt ? (
                      <IonAccordionGroup>
                        <IonAccordion>
                          <IonItem slot="header" button onClick={() => fetchAlternatives(alimento.codice_alt)}>
                            <IonLabel>
                              <strong>{alimento.alimento}</strong> — {alimento.quantità}
                            </IonLabel>
                          </IonItem>
                          <IonList slot="content">
                            {alternativeMap[alimento.codice_alt]?.map((alt: AlternativeItem, i: number) => (
                              <IonItem key={i}>
                                <IonLabel>
                                  ➤ {alt.alimento} — {alt.quantità}
                                </IonLabel>
                              </IonItem>
                            ))}
                          </IonList>
                        </IonAccordion>
                      </IonAccordionGroup>
                    ) : (
                      <IonItem lines="none">
                        <IonLabel>
                          <strong>{alimento.alimento}</strong> — {alimento.quantità}
                        </IonLabel>
                      </IonItem>
                    )}
                  </IonList>
                ))}
              </IonCardContent>
            </IonCard>
          ))}

          {!dieta[giornoSelezionato] && !errore && <p>Caricamento...</p>}
          {dieta[giornoSelezionato]?.length === 0 && (
            <IonText color="medium">Nessun pasto previsto per oggi 🎉</IonText>
          )}
        </IonContent>
      </IonPage>
    </IonApp>
  );
};

export default App;
