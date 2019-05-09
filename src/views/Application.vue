<template>
  <v-container>
    <v-layout row justify-center>

      <v-flex
          xs12
          md6
          sm6
          lg6>

        <material-card
            color="green"
            title="Application Form"
            text="Provide your android application settings">

          <v-form
              @keypress.enter="onSubmit"
              v-model="valid"
              ref="form"
              validation>
            <v-container py-0>
              <v-layout wrap>

                <v-flex xs12>
                  <v-text-field
                      v-model="schoolName"
                      label="School Name"/>
                </v-flex>

                <v-flex xs12>
                  <v-text-field
                      v-model="applicationTitle"
                      label="Application Title"/>
                </v-flex>

                <v-flex xs12>
                  <v-text-field
                      v-model="applicationLanguage"
                      label="Application Language"
                  />
                </v-flex>

                <v-layout row>
                  <color-picker :change="updateColor1" :initial="primaryColor"></color-picker>
                  <v-chip :color="primaryColor">Primary color</v-chip>
                </v-layout>

                <v-layout row>
                  <color-picker :change="updateColor2" :initial="secondaryColor"></color-picker>
                  <v-chip :color="secondaryColor">Secondary color</v-chip>
                </v-layout>


                <v-flex xs6 text-xs-left>
                  <v-btn
                      class="mx-0 font-weight-light"
                      color="success"
                      :disabled="!valid || loading"
                      :loading="loading"
                      @click="generateApplication">
                    Generate
                  </v-btn>
                </v-flex>

                <v-flex xs6 text-xs-right>
                  <v-btn
                      class="mx-0 font-weight-light"
                      color="success"
                      :disabled="!valid || loading"
                      :loading="loading"
                      @click="saveApplication">
                    Save Changes
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </material-card>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>

  import ColorPicker from '../components/helper/Color';

  export default {
    components: {
      "color-picker": ColorPicker
    },
    data: () => ({
      valid: true,
      schoolName: null,
      applicationTitle: null,
      primaryColor: null,
      secondaryColor: null,
      applicationLanguage: null,
    }),
    computed: {
      school() {
        return this.$store.getters.school;
      },
      loading() {
        return this.$store.getters.loading;
      }
    },
	  methods: {
	    updateColor1: function(event) {
		    this.color1 = event.color;
	    },
	    updateColor2: function(event) {
		    this.color2 = event.color;
	    },
	    saveApplication() {
		    let newData = this.school;
		    newData.name = this.schoolName;
		    newData.language = this.applicationLanguage;
		    newData.main_color = parseHSL(this.color1);
		    newData.secondary_color = parseHSL(this.color2);
		    this.$store.dispatch('saveApplication', newData)
            .then(() => this.$store.dispatch('loadSchool')
                .then(() => {
                  this.schoolName = this.school.name;
                  this.applicationTitle = this.school.name;
                  this.applicationLanguage = this.school.language;

                  const hsl1 = parseRGB(this.school.main_color);
                  const hsl2 = parseRGB(this.school.secondary_color);
                  this.primaryColor = hsl1;
                  this.secondaryColor = hsl2;
                }));
	    },
	    generateApplication() {
	      //TODO прописать, как на беке все решат
	    }
	},
    created() {
      this.schoolName = this.school.name;
      this.applicationTitle = this.school.name;
      this.applicationLanguage = this.school.language;

	    const hsl1 = parseRGB(this.school.main_color);
	    const hsl2 = parseRGB(this.school.secondary_color);
      this.primaryColor = hsl1;
      this.secondaryColor = hsl2;
    }
  }

  function parseRGB(rgb) {
    rgb = rgb.slice(1);
    const R = new HexStringToInt64StringConverter(false).convert(rgb.substr(0, 2));
    const G = new HexStringToInt64StringConverter(false).convert(rgb.substr(2, 2));
    const B = new HexStringToInt64StringConverter(false).convert(rgb.substr(4, 2));
    const hsl = rgbToHsl(R, G, B);
    hsl[2] = parseInt(hsl[2] * 100);
    return hsl.toString();
  }

  function parseHSL(hsl) {
    console.log("HSL parse shit", hsl);
    ['hsl', '(', ')', '%', '%'].forEach(symbol => hsl = hsl.replace(symbol, ''));
    console.log('A1', hsl);
    const HSL = hsl.split(',').map(I => parseInt(I));
    console.log('A2', HSL);
    const RGB = hslToRgb(HSL[0], HSL[1] / 100, HSL[2] / 100).map(I => parseInt(I));
    console.log('A3', RGB);
    return RGB
            .map(I => intToHexString(I).toUpperCase())
            .reduce((prev, curr) => {
              return prev.concat(curr)
            }, '#');
  }

  function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;

      s = d / (1 - Math.abs(2*l-1))*100;


      switch (max) {
        case r: {
          h = (((g - b) / d)%6)*60;
          break;
        }
        case g: {
          h = ((b - r) / d + 2)*60;
          break;
        }
        case b: {
          h = ((r - g) / d + 4)*60;
          break;
        }
      }
    }

    return [ h, s, l ];
  }
  function hslToRgb(h, s, l) {
    console.log("to rgb");
    console.log(h,s,l);
    let r,g,b= 0;
    let c = (1 - Math.abs(2*l-1))*s;
    let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    let m = l - c/2;
    if(h<60){
      r=c;
      g=x;
      b=0;
    } else {
      if(h<120){
        r=x;
        g=c;
        b=0;
      } else {
        if(h<180){
          r=0;
          g=c;
          b=x;
        }
        else{
          if(h<240){
            r=0;
            g=x;
            b=c;
          } else {
            if(h<300){
              r=x;
              g=0;
              b=c;
            } else{
              if(h<360){
                r=c;
                g=0;
                b=x;
              }
            }
          }
        }
      }
    }
    console.log( (r+m) * 255, (g+m) * 255, (b+m) * 255);
    return [ (r+m) * 255, (g+m) * 255, (b+m) * 255 ];
  }


  function HexStringToInt64StringConverter(signed) {
	var hexCode = {
	  '0':"0000",
	  '1':"0001",
	  '2':"0010",
	  '3':"0011",
	  '4':"0100",
	  '5':"0101",
	  '6':"0110",
	  '7':"0111",
	  '8':"1000",
	  '9':"1001",
	  'a':"1010",
	  'b':"1011",
	  'c':"1100",
	  'd':"1101",
	  'e':"1110",
	  'f':"1111"
	};
	var preComputedLongMath = {
	  "20":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	  "21":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
	  "22":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
	  "23":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8],
	  "24":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 6],
	  "25":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2],
	  "26":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 4],
	  "27":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 8],
	  "28":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5, 6],
	  "29":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1, 2],
	  "210":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 4],
	  "211":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 4, 8],
	  "212":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 9, 6],
	  "213":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 1, 9, 2],
	  "214":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 6, 3, 8, 4],
	  "215":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 7, 6, 8],
	  "216":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 5, 5, 3, 6],
	  "217":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 1, 0, 7, 2],
	  "218":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 6, 2, 1, 4, 4],
	  "219":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 2, 4, 2, 8, 8],
	  "220":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 4, 8, 5, 7, 6],
	  "221":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 9, 7, 1, 5, 2],
	  "222":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 9, 4, 3, 0, 4],
	  "223":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 3, 8, 8, 6, 0, 8],
	  "224":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 6, 7, 7, 7, 2, 1, 6],
	  "225":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 5, 5, 4, 4, 3, 2],
	  "226":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 7, 1, 0, 8, 8, 6, 4],
	  "227":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 4, 2, 1, 7, 7, 2, 8],
	  "228":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 6, 8, 4, 3, 5, 4, 5, 6],
	  "229":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 3, 6, 8, 7, 0, 9, 1, 2],
	  "230":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 7, 3, 7, 4, 1, 8, 2, 4],
	  "231":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 4, 7, 4, 8, 3, 6, 4, 8],
	  "232":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 9, 4, 9, 6, 7, 2, 9, 6],
	  "233":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 5, 8, 9, 9, 3, 4, 5, 9, 2],
	  "234":[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 7, 1, 7, 9, 8, 6, 9, 1, 8, 4],
	  "235":[0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 3, 5, 9, 7, 3, 8, 3, 6, 8],
	  "236":[0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 8, 7, 1, 9, 4, 7, 6, 7, 3, 6],
	  "237":[0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 7, 4, 3, 8, 9, 5, 3, 4, 7, 2],
	  "238":[0, 0, 0, 0, 0, 0, 0, 0, 2, 7, 4, 8, 7, 7, 9, 0, 6, 9, 4, 4],
	  "239":[0, 0, 0, 0, 0, 0, 0, 0, 5, 4, 9, 7, 5, 5, 8, 1, 3, 8, 8, 8],
	  "240":[0, 0, 0, 0, 0, 0, 0, 1, 0, 9, 9, 5, 1, 1, 6, 2, 7, 7, 7, 6],
	  "241":[0, 0, 0, 0, 0, 0, 0, 2, 1, 9, 9, 0, 2, 3, 2, 5, 5, 5, 5, 2],
	  "242":[0, 0, 0, 0, 0, 0, 0, 4, 3, 9, 8, 0, 4, 6, 5, 1, 1, 1, 0, 4],
	  "243":[0, 0, 0, 0, 0, 0, 0, 8, 7, 9, 6, 0, 9, 3, 0, 2, 2, 2, 0, 8],
	  "244":[0, 0, 0, 0, 0, 0, 1, 7, 5, 9, 2, 1, 8, 6, 0, 4, 4, 4, 1, 6],
	  "245":[0, 0, 0, 0, 0, 0, 3, 5, 1, 8, 4, 3, 7, 2, 0, 8, 8, 8, 3, 2],
	  "246":[0, 0, 0, 0, 0, 0, 7, 0, 3, 6, 8, 7, 4, 4, 1, 7, 7, 6, 6, 4],
	  "247":[0, 0, 0, 0, 0, 1, 4, 0, 7, 3, 7, 4, 8, 8, 3, 5, 5, 3, 2, 8],
	  "248":[0, 0, 0, 0, 0, 2, 8, 1, 4, 7, 4, 9, 7, 6, 7, 1, 0, 6, 5, 6],
	  "249":[0, 0, 0, 0, 0, 5, 6, 2, 9, 4, 9, 9, 5, 3, 4, 2, 1, 3, 1, 2],
	  "250":[0, 0, 0, 0, 1, 1, 2, 5, 8, 9, 9, 9, 0, 6, 8, 4, 2, 6, 2, 4],
	  "251":[0, 0, 0, 0, 2, 2, 5, 1, 7, 9, 9, 8, 1, 3, 6, 8, 5, 2, 4, 8],
	  "252":[0, 0, 0, 0, 4, 5, 0, 3, 5, 9, 9, 6, 2, 7, 3, 7, 0, 4, 9, 6],
	  "253":[0, 0, 0, 0, 9, 0, 0, 7, 1, 9, 9, 2, 5, 4, 7, 4, 0, 9, 9, 2],
	  "254":[0, 0, 0, 1, 8, 0, 1, 4, 3, 9, 8, 5, 0, 9, 4, 8, 1, 9, 8, 4],
	  "255":[0, 0, 0, 3, 6, 0, 2, 8, 7, 9, 7, 0, 1, 8, 9, 6, 3, 9, 6, 8],
	  "256":[0, 0, 0, 7, 2, 0, 5, 7, 5, 9, 4, 0, 3, 7, 9, 2, 7, 9, 3, 6],
	  "257":[0, 0, 1, 4, 4, 1, 1, 5, 1, 8, 8, 0, 7, 5, 8, 5, 5, 8, 7, 2],
	  "258":[0, 0, 2, 8, 8, 2, 3, 0, 3, 7, 6, 1, 5, 1, 7, 1, 1, 7, 4, 4],
	  "259":[0, 0, 5, 7, 6, 4, 6, 0, 7, 5, 2, 3, 0, 3, 4, 2, 3, 4, 8, 8],
	  "260":[0, 1, 1, 5, 2, 9, 2, 1, 5, 0, 4, 6, 0, 6, 8, 4, 6, 9, 7, 6],
	  "261":[0, 2, 3, 0, 5, 8, 4, 3, 0, 0, 9, 2, 1, 3, 6, 9, 3, 9, 5, 2],
	  "262":[0, 4, 6, 1, 1, 6, 8, 6, 0, 1, 8, 4, 2, 7, 3, 8, 7, 9, 0, 4],
	  "263":[0, 9, 2, 2, 3, 3, 7, 2, 0, 3, 6, 8, 5, 4, 7, 7, 5, 8, 0, 8],
	  "264":[1, 8, 4, 4, 6, 7, 4, 4, 0, 7, 3, 7, 0, 9, 5, 5, 1, 6, 1, 6],
	  "265":[3, 6, 8, 9, 3, 4, 8, 8, 1, 4, 7, 4, 1, 9, 1, 0, 3, 2, 3, 2]
	};
	if (typeof(signed) != 'boolean') signed = false;
	function toBinary(hex) {
	  hex = hex.toLowerCase();
	  var binary = "";
	  for (var i = 0; i < hex.length; i++) {
		binary += hexCode[hex[i]];
	  }
	  return binary;
	}

	function to1nsComplement(binary) {
	  var compliment = "";
	  for (var i = 0; i < binary.length; i++) {
		compliment += (binary.charAt(i) == "1" ? "0" : "1");
	  }
	  return compliment;
	}

	function arrayAdd(a, b) {
	  var carry = 0;
	  var number = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	  for (var i = 19; i >= 0; i--) {
		number[i] = a[i] + b[i] + carry;
		if (number[i].toString().length > 1) {
		  carry = parseInt(number[i].toString().substring(0, number[i].toString().length - 1), 10);
		  number[i] = parseInt(number[i].toString().substring(number[i].toString().length - 1), 10)
		} else {
		  carry = 0;
		}
	  }
	  return number;
	}

	function removeZeroPad(number) {
	  var lock = false;
	  var output = [];
	  for (var i = 0; i < number.length; i++) {
		if (lock) {
		  output.push(number[i]);
		} else {
		  if (number[i] != 0) {
			lock = true;
			output.push(number[i]);
		  }
		}
	  }
	  return output;
	}

	function binaryToDec(binary) {
	  var negative = false;
	  if (signed && (binary.charAt(0) == 1)) {
		negative = true;
	  }
	  if (signed) {
		binary = binary.substring(1);
		if (negative) {
		  binary = to1nsComplement(binary);
		}
	  }
	  var pos = 0;
	  var number = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	  for (var i = binary.length - 1; i >= 0; i--) {
		if (binary.charAt(i) == 1) {
		  number = arrayAdd(number, preComputedLongMath["2" + pos])
		}
		pos++;
	  }
	  if (negative) {
		number = removeZeroPad(arrayAdd(number, preComputedLongMath["20"]));
		number.splice(0, 0, "-");
	  } else {
		number = removeZeroPad(number);
	  }
	  return number.join("");
	}

	this.convert = function (hex) {
	  var binary = toBinary(hex);
	  return binaryToDec(binary);
	};
  }

  function intToHexString(int) {
	if (int <= 15) {
	  return '0'.concat(int.toString(16));
	}
	return int.toString(16);
  }

</script>
