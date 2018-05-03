import _ from 'lodash';
import directory from '../ListOfData';
import Stellar from 'stellar-sdk';
const AssetSlug = {
    parseAssetSlug(slug) {
        if (!_.isString(slug)) {
            throw new Error('Stellarify.parseAssetSlug slug must be a string');
        }

        let hyphenIndex = slug.indexOf('-');
        if (hyphenIndex < 1) {
            throw new Error('Stellarify.parseAssetSlug expected slug to be split into two with hyphen')
        }

        let code = slug.substr(0, hyphenIndex);
        let issuer = slug.substr(hyphenIndex + 1);

        if (code.length > 12) {
            throw new Error(`Stellarify.parseAssetSlug expected asset code to be 12 or fewer characters. Input: ${code}`)
        }

        if (issuer === 'native') {
            if (code !== 'XLM') {
                console.error(`Native issuers must have XLM code`);
            }
            issuer = null;
        }
        else if (!Stellar.StrKey.isValidEd25519PublicKey(issuer)) {
            let asset = directory.getAssetByDomain(code, issuer);
            if (asset !== null) {
                issuer = asset.issuer;
            }
        }


        return new Stellar.Asset(code, issuer);
    },
};

export default AssetSlug;
