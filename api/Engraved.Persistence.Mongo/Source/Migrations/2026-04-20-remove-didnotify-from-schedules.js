const migrateCollection = (collectionName) => {
  db.getCollection(collectionName).updateMany(
    { Schedules: { $exists: true } },
    [
      {
        $set: {
          Schedules: {
            $arrayToObject: {
              $map: {
                input: { $objectToArray: { $ifNull: ["$Schedules", {}] } },
                as: "scheduleEntry",
                in: {
                  k: "$$scheduleEntry.k",
                  v: {
                    $let: {
                      vars: {
                        schedule: "$$scheduleEntry.v"
                      },
                      in: {
                        $arrayToObject: {
                          $map: {
                            input: {
                              $objectToArray: {
                                $mergeObjects: [
                                  "$$schedule",
                                  {
                                    NotifiedOn: {
                                      $cond: [
                                        {
                                          $and: [
                                            { $eq: ["$$schedule.NotifiedOn", null] },
                                            { $eq: ["$$schedule.DidNotify", true] }
                                          ]
                                        },
                                        "$$schedule.NextOccurrence",
                                        "$$schedule.NotifiedOn"
                                      ]
                                    }
                                  }
                                ]
                              }
                            },
                            as: "field",
                            in: {
                              k: "$$field.k",
                              v: "$$field.v"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      {
        $set: {
          Schedules: {
            $arrayToObject: {
              $map: {
                input: { $objectToArray: { $ifNull: ["$Schedules", {}] } },
                as: "scheduleEntry",
                in: {
                  k: "$$scheduleEntry.k",
                  v: {
                    $arrayToObject: {
                      $filter: {
                        input: { $objectToArray: "$$scheduleEntry.v" },
                        as: "field",
                        cond: { $ne: ["$$field.k", "DidNotify"] }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    ]
  );
};

migrateCollection("entries");
migrateCollection("journals");
