

export abstract class StringHelper {




/*-----------------------------------------------------------*/



/**
 * Sanitize compound firstname (i.e Jean Luc => Jean-Luc)
 * @param firstname
 * @returns string firstname correctly spelled
 *//*


/**
 * @param value String to convert
 * @returns a string with dashes instead of spaces except leading et trailing spaces
 * @usage StringHelper.replaceSpaceWithDashes ('string to replace')
 */
public static replaceSpaceWithDash (value: string) : string {
  return StringHelper.removeSpaces(value).replace(' ', '-')
}

//WITH SASHA
public static sanitizeFirstName(firstname: string): string {
  const regex: RegExp = /[ ]+/g
  const cleanFirstname : string = StringHelper.removeSpaces(firstname).replace(regex, '-')
  return cleanFirstname;
}




/*-----------------------------------------------------------*/


  /**
   *
   * @param value string to remove leading chars
   * @param regexp  Pattern of unexpected chars
   * @returns StringHelper.removeUnexpectedLeadingChars('my string, /[-8]/g)
   */
  public static removeUnexpectedLeadingChars(value: string, regex: RegExp): string {   //-_pia
    let firstChar : string = value.charAt(0);
    while(firstChar.match(regex)){
      value = value.substring(1);  // -
      firstChar = value.charAt(0);
    }
    return value;
  }

  /**
   * @param value string to remove leading chars
   * @param regexp  Pattern of unexpected chars
   * @returns StringHelper.removeUnexpectedLeadingChars('my string, /[-8]/g)
   */
  public static removeUnexpectedTrailingChars(value: string, regex: RegExp): string {
    value = value.split('').reverse().join('') ;
    value = StringHelper.removeUnexpectedLeadingChars(value, regex);
    return value.split('').reverse().join('');
  }


  /*---------------------------------------------------------------------------------*/

    /**
   * @param {string} input
   * @returns string without leading and trailling white space
   * @usage StringHelper.removeSpaces('string to trim')
   */
     public static removeSpaces(input: string): string {
      return input.trim();
  }


  /**
   * Sanitize string ponctuation according language
   * @param input String to sanitize
   * @param locale Language to use to sanitize
   * @returns string input with correct ponctuation
   *
   * @usage
   *  input => La méthode s'utilise de la manière suivante: sanitize
   *  locale => fr
   *  Must return : La méthode s'utilise de la manière suivante : sanitize
   *  locale => us
   *  Must return : La méthode s'utilise de la manière suivante: sanitize
   *
   * French language
   *  => : | ; One space before, One space after
   *  => ,|. One space after
   * English languages
   *  => : | ; One space after only
   *  => ,|. One space after
   */






  //---------------------------
  /**
   * Sanitize string ponctuation according language
   * @param input String to sanitize
   * @param locale Optionel locale to compute, default fr
   * @returns string input with correct ponctuation
   *
   * @usage
   * */

  public static sanitizePonctuation(value: string, locale?: string): string {
    if (locale === undefined) {    // si pas de langage de defini alors la langue par default sera le français
       locale = 'fr';
    }

    if (value.match(/[.;,:\!\?]/g) === null) {   // si les valeurs recherchées ne sont pas présentes, alors je retourne la valeur
      return value;
    }

    const initialValue: string[] = value.split('')   // divise la chaine de caracteres lettre par lettre. SPLIT() FONDAMENTAlE POUR FAIRE FOR
    const outputValue: string[] = []
    let output: string = ''

    for (let i : number = 0; i < initialValue.length; i++ ) {

      const previousChar: string = initialValue[i - 1]; //va chercher le caractere le caractère  ( on veut avant la virgule)
      const nextChar : string = initialValue[i + 1];   //ira chercher le char après le char pour !?:

        /*
    Si ces ponctuations sont présentes ALORS
    SI il n' a pas d'espace ALORS
    Je rajoute un espace
    SI pas d'espace après alors j'en ajoute un après
    */

      if (initialValue[i] === ';' || initialValue[i] === ':' || initialValue[i] === '?'  || initialValue[i] === '!') {
        console.log(`J'ai trouvé un truc à faire avec un espace av et ap`)

        output = output.substring(0, output.length) //en string
        let splitOutput : string[] = output.split('').reverse() //en tableau
        output = splitOutput.join('').trimStart() //en string
        splitOutput = output.split('').reverse() //en tableau
        output = splitOutput.join('')   // version fini sans espaces


        console.log(output +'a')
        //initialValue = initialValue.reverse();
        //initialValue.join('').trimStart();



        if( previousChar !== ' '){
          output = output.substring(0, output.length) + ' ' + initialValue[i];
        } else {
          output = output + initialValue[i]
        }
        if( nextChar !== ' ') {
          output = output.substring(0, output.length + 1) + ' ' ;
        }

      } else {
        if (initialValue[i] === ',' || initialValue[i] ==='.') {
          console.log(`J'ai trouvé un truc à faire avec la virgule et le point`)

          if (previousChar === ' ') {
            output = output.substring(0, output.length -1) + initialValue[i]  // 0 pour concervé le C maj, debut de la chaine parcourue
          } else {
            output = output + initialValue[i]
          }
        } else {
            output = output + initialValue[i];
        }
      }
    }
    return output;
  }
}
