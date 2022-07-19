# gemworks_rarity_configuration

Open up the script `set_rarity.ts`, and first of all read it

Then:

+ consider updating the IDLs and the @gemworks version to match the program version if needed
+ change all the `stakingDefaults` to attack your farm
+ set the keypair of the farm manager on `manager`
+ set up all the rarities on the `rarities` constant
+ test it first on devnet
+ run `yarn && yarn execute` or `npm install && npm run execute` to run the script
