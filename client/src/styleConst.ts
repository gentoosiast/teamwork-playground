export const generalColor = 'rgb(0, 4, 23)';
export const backGroundColor = 'rgb(109, 128, 155)';
export const backGroundColorOpacity = 'rgb(109, 128, 155, 0.7)';

export const fontSize ={
    'fontLarge':{
        '1080':'80px',
        '768': '60px',
        '575': '40px',
    },
    'fontMiddle':{
        '1080':'40px',
        '768': '30px',
        '575': '20px',
    },
    'fontSmall':{
        '1080': '20px',
        '768': '15px',
        '575': '10px',
    }
}
const sizes = {
    mobile: '575px',
    tablet: '768px',
    laptop: '1320px',
  };

  export const devices = {
    mobileWidht: `(max-width: ${sizes.mobile})`,
    tabletWidht: `(max-width: ${sizes.tablet})`,
    mobileHeight: `(max-height: ${sizes.mobile})`,
    tabletHeight: `(max-height: ${sizes.tablet})`,
    laptopWeight: `(max-width: ${sizes.laptop})`,
  };