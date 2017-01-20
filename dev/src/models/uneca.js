module.exports = {
    metadata : {
        "creationDate" : 1447887600000,
        "language" : {
            "version" : "1998",
            "codes" : [ {
                "code" : "eng",
                "label" : {
                    "FR" : "English",
                    "EN" : "English"
                }
            } ],
            "idCodeList" : "ISO639-2",
            "extendedName" : {
                "EN" : "International Standard Organization - Language"
            }
        },
        "dsd" : {
            "contextSystem" : "uneca",
            "datasources" : [ "D3S" ],
            "rid" : "66_2503",
            "columns" : [ {
                "dataType" : "code",
                "key" : false,
                "id" : "DomainCode",
                "title" : {
                    "EN" : "Domain"
                },
                "domain" : {
                    "codes" : [ {
                        "idCodeList" : "UNECA_ClassificationOfActivities",
                        "extendedName" : {
                            "EN" : "UNECA Classification of Activities -Domains, topics and indicators"
                        }
                    } ]
                }
            }, {
                "dataType" : "code",
                "key" : false,
                "id" : "TopicCode",
                "title" : {
                    "EN" : "Topic"
                },
                "domain" : {
                    "codes" : [ {
                        "idCodeList" : "UNECA_ClassificationOfActivities",
                        "extendedName" : {
                            "EN" : "UNECA Classification of Activities -Domains, topics and indicators"
                        }
                    } ]
                }
            }, {
                "dataType" : "code",
                "key" : true,
                "id" : "IndicatorCode",
                "title" : {
                    "EN" : "Indicator"
                },
                "domain" : {
                    "codes" : [ {
                        "idCodeList" : "UNECA_ClassificationOfActivities",
                        "extendedName" : {
                            "EN" : "UNECA Classification of Activities -Domains, topics and indicators"
                        }
                    } ]
                },
                "subject" : "item"
            }, {
                "dataType" : "code",
                "key" : true,
                "id" : "CountryCode",
                "title" : {
                    "EN" : "Country"
                },
                "domain" : {
                    "codes" : [ {
                        "idCodeList" : "ISO3",
                        "extendedName" : {
                            "EN" : "International Standard Organization - Geographic names"
                        }
                    } ]
                },
                "subject" : "geo"
            }, {
                "dataType" : "year",
                "key" : true,
                "id" : "Year",
                "title" : {
                    "EN" : "Year"
                },
                "subject" : "time"
            }, {
                "dataType" : "code",
                "key" : true,
                "id" : "GenderCode",
                "title" : {
                    "EN" : "Gender"
                },
                "domain" : {
                    "codes" : [ {
                        "idCodeList" : "UNECA_Gender",
                        "extendedName" : {
                            "EN" : "UNECA - Gender"
                        }
                    } ]
                }
            }, {
                "dataType" : "code",
                "key" : true,
                "id" : "AgeRangeCode",
                "title" : {
                    "EN" : "Age Range"
                },
                "domain" : {
                    "codes" : [ {
                        "idCodeList" : "UNECA_AgeRange",
                        "extendedName" : {
                            "EN" : "UNECA Age-range"
                        }
                    } ]
                }
            }, {
                "dataType" : "number",
                "key" : false,
                "id" : "Value",
                "title" : {
                    "EN" : "Value"
                },
                "subject" : "value"
            } ]
        },
        "rid" : "12_916",
        "uid" : "Uneca_PopulationNew",
        "title" : {
            "EN" : "Population"
        },
        "meContent" : {
            "resourceRepresentationType" : "dataset",
            "seCoverage" : {
                "coverageSectors" : {
                    "codes" : [ {
                        "code" : "0101",
                        "label" : {
                            "EN" : "Population"
                        }
                    } ],
                    "idCodeList" : "UNECA_ClassificationOfActivities",
                    "extendedName" : {
                        "EN" : "UNECA Classification of Activities -Domains, topics and indicators"
                    }
                },
                "coverageTime" : {
                    "from" : 1093903200000,
                    "to" : 1467151200000
                },
                "coverageGeographic" : {
                    "version" : "2014",
                    "codes" : [ {
                        "code" : "999900001"
                    } ],
                    "idCodeList" : "GAUL0",
                    "extendedName" : {
                        "EN" : "Global administrative unit layer country level"
                    }
                }
            },
            "resourceRepresentationTypeLabel" : {
                "EN" : "Dataset"
            }
        },
        "characterSet" : {
            "codes" : [ {
                "code" : "106",
                "label" : {
                    "FR" : "UTF-8",
                    "EN" : "UTF-8"
                }
            } ],
            "idCodeList" : "IANAcharacterSet",
            "extendedName" : {
                "EN" : "Internet Assigned Numbers Authority codelist"
            }
        },
        "metadataStandardName" : "FENIX",
        "metadataStandardVersion" : "1.0",
        "metadataLanguage" : {
            "version" : "1998",
            "codes" : [ {
                "code" : "eng",
                "label" : {
                    "FR" : "English",
                    "EN" : "English"
                }
            } ],
            "idCodeList" : "ISO639-2",
            "extendedName" : {
                "EN" : "International Standard Organization - Language"
            }
        },
        "contacts" : [ {
            "organization" : {
                "EN" : "ECA"
            },
            "role" : "owner",
            "contactInfo" : {
                "emailAddress" : "acs@uneca.org"
            },
            "roleLabel" : {
                "FR" : "Propriétaire",
                "EN" : "Owner"
            }
        } ],
        "meInstitutionalMandate" : { },
        "meMaintenance" : {
            "seUpdate" : {
                "updatePeriodicity" : {
                    "version" : "1.0",
                    "codes" : [ { } ],
                    "idCodeList" : "FAO_Period",
                    "extendedName" : {
                        "EN" : "FAO Reference Period"
                    }
                },
                "updateDate" : 1449442800000
            }
        }
    }
};