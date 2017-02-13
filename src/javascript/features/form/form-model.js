import State from "ampersand-state";
import sync from "ampersand-sync";
import qs from "qs";
import {Promise} from "es6-promise";

let Form = State.extend({

    ajaxConfig: {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Requested-With": "XMLHttpRequest"
        }
    },

    props: {
        action: ["string", true, "contactForm/sendMessage"],
        fields: ["object", true, function(){
          return {
              author: "CADMAN",
              emailTo: "werner.horn@corpussireo.com",
              emailCc: "t.trendelkamp@bpd-de.de, t.goetz@bpd-de.de",
              emailBcc: "interactive@cadman.de",
              emailFrom: "no-reply@karolinger-wohnen.de",
              subject: "Web Kontakt Anfrage Karolinger Höfe:",
          }
        }],
        error: ["boolean", false, false],
        success: ["boolean", true, false]
    },

    session: {
        isSending: ["boolean", true, false]
    },

    derived: {
        isSend: {
            deps: ["success"],
            fn: function () {
                return this.success;
            }
        }
    },

    send: function (attrs) {

        let that = this;
        if (attrs) {
            this.set(attrs);
        }
        this.isSending = true;

        return new Promise(function (resolve, reject) {
            that._request = sync.call(that, "create", that, {
                data: qs.stringify(that.fields),
                url: "/ajaxform/sendEmail.php",
                error: function (resp, state, msg) {
                    that.isSending = false;
                    reject(new Error(msg));
                },
                success: function (resp) {
                    that.isSending = false;
                    if (resp.success) {
                        that.success = true;
                        resolve(that);
                    } else if (resp.error) {
                        that.error = resp.error;
                        reject(new Error("The message did not validate."));
                    }
                }
            });
        });
    },

});

module.exports = Form;
