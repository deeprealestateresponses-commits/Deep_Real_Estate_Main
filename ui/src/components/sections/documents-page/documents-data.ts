/**
 * Every document the live site publishes, scraped from its Documents page on
 * 2 Aug 2026 — 27 files, with the titles the site itself gives them.
 *
 * `file` is a name under /public/docs, so the browser hands the download
 * straight to Word / WPS / Numbers. Categories come from the suffix the live
 * titles carry ("… Huda Document", "… General Document"); the newer "Format of
 * …" set has no suffix and forms its own group.
 */
export type DocCategory = 'General' | 'HUDA' | 'Formats';

export type DocumentItem = {
  /** Filename under /public/docs. */
  file: string;
  title: string;
  category: DocCategory;
  ext: 'doc' | 'docx';
  sizeKb: number;
};

export const documents: DocumentItem[] = [
  { file: 'AGREEMENTTOSELL.doc', title: 'Agreement To Sale', category: 'General', ext: 'doc', sizeKb: 32 },
  { file: 'Form60.doc', title: 'Form 60', category: 'General', ext: 'doc', sizeKb: 28 },
  { file: 'GIFTDEEDFORRELATIVE.doc', title: 'Gift Deed For Relative', category: 'General', ext: 'doc', sizeKb: 36 },
  { file: 'GPAforNRI.doc', title: 'GPA For NRI', category: 'General', ext: 'doc', sizeKb: 26 },
  { file: 'LEASEDEED.doc', title: 'Lease Deed', category: 'General', ext: 'doc', sizeKb: 30 },
  { file: '01partpayment.doc', title: 'Part Payment', category: 'General', ext: 'doc', sizeKb: 24 },
  { file: 'spa.doc', title: 'Special Power of Attorney', category: 'General', ext: 'doc', sizeKb: 26 },
  { file: '23_ALLOTMENT_ACCEPTENCE.doc', title: 'Acceptance of Allotment', category: 'HUDA', ext: 'doc', sizeKb: 20 },
  { file: '16_ADV_RECPT.doc', title: 'Advance Receipt', category: 'HUDA', ext: 'doc', sizeKb: 24 },
  { file: '22_ALLOTMENT_MONEY_DEPOSIT_AFFIDAVIT.doc', title: 'Affidavit for Allotment Money Deposit', category: 'HUDA', ext: 'doc', sizeKb: 26 },
  { file: '18_RESERVE_CATEGORY_ALLOTMENT_AFFIDAVIT.doc', title: 'Affidavit for Reserve Category Allotment', category: 'HUDA', ext: 'doc', sizeKb: 26 },
  { file: '13_SALE_AGREEMENT_IF_HUDA-_PLOT_SOLD_ON_ATTORNEY.doc', title: 'Agreement to Sale (if sold on attorney)', category: 'HUDA', ext: 'doc', sizeKb: 27 },
  { file: '20_HUDA_PLOT_POSSESSION_APPLY.doc', title: 'Application of Plot Possession', category: 'HUDA', ext: 'doc', sizeKb: 19 },
  { file: '21_HUDA_PLOT_POSSESSION_APPLY_IN_TRIPLICATE.doc', title: 'Application of Plot Possession in Triplicate', category: 'HUDA', ext: 'doc', sizeKb: 22 },
  { file: 'certificate_possession_of_the_plot.doc', title: 'Certificate of Possession of Plot', category: 'HUDA', ext: 'doc', sizeKb: 21 },
  { file: '5_HUDA_PURCHASER_FINAL_AFFIDAVIT.doc', title: 'Final Affidavit from Purchaser', category: 'HUDA', ext: 'doc', sizeKb: 23 },
  { file: 'huda_final_joint_affidavit.doc', title: 'Final Joint Affidavit', category: 'HUDA', ext: 'doc', sizeKb: 21 },
  { file: '19_SELLER_NOC_AFTER_PERMISSION_APPLIED_OR_GRANTEFD.doc', title: 'Seller NOC', category: 'HUDA', ext: 'doc', sizeKb: 26 },
  { file: '17_SPECIMEN_SIGNATURE_AFFIDAVIT.doc', title: 'Specimen Signature Affidavit', category: 'HUDA', ext: 'doc', sizeKb: 20 },
  { file: '15_WILL.doc', title: 'Will', category: 'HUDA', ext: 'doc', sizeKb: 20 },
  { file: 'Format_Advance_Receipt_English__New.docx', title: 'Format Advance Receipt English', category: 'Formats', ext: 'docx', sizeKb: 17 },
  { file: 'Format_of_Agreement_to_Sale_for_Agricultural_Land___New.docx', title: 'Format of Agreement to Sale for Agricultural Land', category: 'Formats', ext: 'docx', sizeKb: 18 },
  { file: 'Format_of_Agreement_to_Sale_of_Floors_in_Private_Builder_Colony__New.docx', title: 'Format of Agreement to Sale of Floors in Private Builder Colony', category: 'Formats', ext: 'docx', sizeKb: 20 },
  { file: 'Format_of_Agreement_to_Sale_of_Plot_in_Sushant_Lok__New.docx', title: 'Format of Agreement to Sale of Plot in Sushant Lok', category: 'Formats', ext: 'docx', sizeKb: 17 },
  { file: 'Format_of_Agreement_to_Sale_on_House_in_Sushant_Lok__New.docx', title: 'Format of Agreement to Sale on House in Sushant Lok', category: 'Formats', ext: 'docx', sizeKb: 20 },
  { file: 'Format_of_Floor_Partition_Deed__New.docx', title: 'Format of Floor Partition Deed', category: 'Formats', ext: 'docx', sizeKb: 27 },
  { file: 'Format_of_Transfer_Deed__New.docx', title: 'Format of Transfer Deed', category: 'Formats', ext: 'docx', sizeKb: 17 },
];

/* Group order only. No descriptions: the live site does not caption these
   groups, and a written-up sentence under each heading is padding. */
export const documentGroups: { category: DocCategory }[] = [
  { category: 'General' },
  { category: 'HUDA' },
  { category: 'Formats' },
];
