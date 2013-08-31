<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

require_once 'libmail.php';


function check_email_address($email) {
// First, we check that there's one @ symbol, and that the lengths are right
    if (!ereg("^[^@]{1,64}@[^@]{1,255}$", $email)) {
    // Email invalid because wrong number of characters in one section, or wrong number of @ symbols.
        return false;
    }
    // Split it into sections to make life easier
    $email_array = explode("@", $email);
    $local_array = explode(".", $email_array[0]);
    for ($i = 0; $i < sizeof($local_array); $i++) {
        if (!ereg("^(([A-Za-z0-9!#$%&'*+/=?^_`{|}~-][A-Za-z0-9!#$%&'*+/=?^_`{|}~\.-]{0,63})|(\"[^(\\|\")]{0,62}\"))$", $local_array[$i])) {
            return false;
        }
    }
    if (!ereg("^\[?[0-9\.]+\]?$", $email_array[1])) { // Check if domain is IP. If not, it should be valid domain name
        $domain_array = explode(".", $email_array[1]);
        if (sizeof($domain_array) < 2) {
            return false; // Not enough parts to domain
        }
        for ($i = 0; $i < sizeof($domain_array); $i++) {
            if (!ereg("^(([A-Za-z0-9][A-Za-z0-9-]{0,61}[A-Za-z0-9])|([A-Za-z0-9]+))$", $domain_array[$i])) {
                return false;
            }
        }
    }
    return true;
}


function validarCampos($campos){
    $validaciones = array();
    foreach ($campos as $clave => $valor) {

        if(strlen($valor) == 0){
            $validaciones[$clave] = 'Todos los campos son requeridos';
        }

        if($clave=='from' && !check_email_address($valor)){
            $validaciones[$clave] = 'Email mal formado';
        }
    }
    return $validaciones;
}


$campos = array(
    'name' => $_REQUEST['name'],
    'from' => $_REQUEST['email'],
    'subject' => $_REQUEST['subject'],
    'body' => $_REQUEST['body']
);


$to = 'contact@arg-team.com';

$resultado = array();

$validaciones = validarCampos($campos);

if(count($validaciones) == 0){
    $mail = new Mail();
    $mail->From($campos['from']);
    $mail->To($to);
    $mail->Body($campos['body']);
    $mail->Cc($campos['from']);
    $mail->Subject($campos['subject']);
    $mail->Send();
}else{
    $resultado['validaciones'] = $validaciones;
}

echo json_encode($resultado);

?>