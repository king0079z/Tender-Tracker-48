export interface Company {
  id: string;
  name: string;
  contacts: string[];
  scope: {
    media: boolean;
    ai: boolean;
  };
}

export const companies: Company[] = [
  { id: '1', name: 'Accenture', contacts: ['meidi.elkhater@accenture.com'], scope: { media: true, ai: true } },
  { id: '2', name: 'Atos', contacts: ['aleksandra.tyszkiewicz@atos.net'], scope: { media: true, ai: true } },
  { id: '3', name: 'BCG', contacts: ['Pardo.Alberto@bcg.com'], scope: { media: true, ai: true } },
  { id: '4', name: 'Cognizant', contacts: ['inquiry@cognizant.com', 'maged.wassim@gmail.com'], scope: { media: false, ai: true } },
  { id: '5', name: 'Dell', contacts: ['Tarek_Elkadi@Dell.com', 'Mohamad.berjawi@dell.com'], scope: { media: false, ai: true } },
  { id: '6', name: 'Delloitte', contacts: ['nkhoury@deloitte.com'], scope: { media: true, ai: true } },
  { id: '7', name: 'Digitas', contacts: ['Kareem.monem@digitas.com'], scope: { media: false, ai: true } },
  { id: '8', name: 'Diversified', contacts: ['Lsmeding@onediversified.com'], scope: { media: true, ai: false } },
  { id: '9', name: 'EY', contacts: ['Ahmad.alshaer@qa.ey.com', 'Marwan.ajami1@qa.ey.com'], scope: { media: false, ai: true } },
  { id: '10', name: 'GlobalLogic', contacts: ['leeon.fleming@globallogic.com'], scope: { media: true, ai: true } },
  { id: '11', name: 'GlobeCast', contacts: ['Giorgio.Giacomini@globecastme.com'], scope: { media: true, ai: false } },
  { id: '12', name: 'IBM', contacts: ['wissam.shmait1@ibm.com'], scope: { media: false, ai: true } },
  { id: '13', name: 'InfoSys', contacts: ['prabhsimran.singh01@infosys.com'], scope: { media: true, ai: true } },
  { id: '14', name: 'KPMG', contacts: ['ahmedbenabdallah@kpmg.com'], scope: { media: false, ai: true } },
  { id: '15', name: 'Mckinsey', contacts: ['Clayton_OToole@mckinsey.com'], scope: { media: false, ai: true } },
  { id: '17', name: 'NEP', contacts: ['jrahme@nepgroup.com'], scope: { media: true, ai: false } },
  { id: '18', name: 'PWC', contacts: ['jadoun.naber@pwc.com'], scope: { media: true, ai: true } },
  { id: '19', name: 'Qvest', contacts: ['ahmad.kayal@qvest.com'], scope: { media: true, ai: false } },
  { id: '20', name: 'SoftServe', contacts: ['vkaratov@cisco.com'], scope: { media: false, ai: true } },
  { id: '21', name: 'SouthWorks', contacts: ['gerardo.meola@southworks.com'], scope: { media: false, ai: true } },
  { id: '22', name: 'TenX', contacts: ['adnan@tenx.ai'], scope: { media: false, ai: true } },
  { id: '23', name: 'Valtech', contacts: ['vishal.rami@valtech.com'], scope: { media: false, ai: true } },
  { id: '24', name: 'Whyfive', contacts: ['Ahmed@whyfive.com'], scope: { media: false, ai: true } },
];