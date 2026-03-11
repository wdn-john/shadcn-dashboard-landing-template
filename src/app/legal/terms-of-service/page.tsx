import { LandingNavbar } from "@/app/landing/components/navbar"
import React from "react"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <LandingNavbar />

      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Title */}
        <h1 className="text-3xl font-bold text-foreground mb-1">
          Terms and Conditions – Worked<span className="text-primary">In</span>
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last updated: March 4, 2026 &nbsp;·&nbsp; Workedin Enterprises Inc.
        </p>

        <div className="space-y-8 text-sm text-foreground leading-relaxed">

          {/* Definitions */}
          <section>
            <h2 className="text-xl font-bold mb-3">Definitions</h2>
            <div className="space-y-3">
              <p><strong>Workedin Enterprises Inc.</strong> (hereinafter referred to as <strong>&quot;Workedin&quot;</strong>): Refers to the entity operating the online platform accessible at Workedin.com and the associated mobile application. Workedin manages, develops, and administers the services offered to registered Users on these platforms.</p>
              <p><strong>Client</strong> (hereinafter referred to as <strong>&quot;DO&quot;</strong>): Refers to a User who uses the Workedin platform to publish or offer projects, with the aim of finding an expert to carry them out. The DO acts as the client in the exchanges conducted through the platform.</p>
              <p><strong>Expert</strong>: Refers to a User who uses the Workedin platform to offer their professional services in order to execute the mandates proposed by the DOs.</p>
              <p><strong>User</strong>: Refers to any person registered on the Workedin platform, either as a DO or an Expert, who uses the services or features offered there.</p>
              <p><strong>Parties</strong>: Refers to the DO and the Expert involved in a dispute or litigation arising out of a service or the execution of the mandate.</p>
              <p><strong>Official identification document</strong>: Refers to either the User&apos;s Driver&apos;s License, Health Insurance Card, or Passport.</p>
              <p><strong>Stripe</strong>: Refers to Stripe Inc., the secure technology platform for processing electronic payments. It offers businesses services to accept and manage online payments, including credit card, bank transfer, and digital wallets (such as Apple Pay and Google Pay).</p>
              <p><strong>Third Party</strong>: Refers to any natural or legal person other than the DO, the Expert, or Workedin.</p>
              <p><strong>Terms and Conditions</strong>: This document sets out the rules, terms, and conditions governing access to, navigation of, and use of the Workedin platform, including the mobile application and website. These Terms and Conditions govern the relationship between Workedin and Users, particularly with regard to registration, posting of assignments, offering of services, communications, payments, and any other functionality or service offered through the platform.</p>
              <p>Les présents Termes et Conditions régissent la relation légale entre Workedin en tant qu&apos;exploitant de la plateforme en ligne et de l&apos;application mobile Workedin.com et des Utilisateurs inscrits sur cette plateforme en ligne. Ces conditions d&apos;utilisation régissent l&apos;utilisation de la plateforme Workedin, y compris l&apos;utilisation du blogue ou du chat de Workedin, exclusivement et indépendamment du périphérique final ou du système d&apos;exploitation utilisé, y compris l&apos;utilisation des services via les applications correspondantes.</p>
            </div>
          </section>

          {/* 1.0 */}
          <section>
            <h2 className="text-xl font-bold mb-3">1.0 Champs d&apos;application</h2>
            <div className="space-y-3">
              <p><strong>1.1</strong> Les conditions générales de l&apos;Utilisateur qui diffèrent, s&apos;opposent ou s&apos;écartent des présentes ne s&apos;appliqueront que si, et dans la mesure où, elles ont été expressément reconnues par écrit par Workedin. À défaut d&apos;une telle reconnaissance écrite, seules les conditions générales de Workedin prévalent.</p>
              <p><strong>1.2</strong> En utilisant la plateforme Workedin, vous acceptez et approuvez par le fait même les Termes et Conditions d&apos;utilisation de Workedin et ce, en votre nom ou au nom de votre employeur ou de toute autre entité le cas échéant. En utilisant la plateforme Workedin, vous êtes tenu au respect des présents Termes et Conditions, les conditions de paiement Workedin, les normes de service Workedin et toutes les normes, conditions, politiques, directives et informations supplémentaires qui sont incorporées aux présents par référence. Si vous ne souhaitez pas accepter ces Termes et Conditions, vous ne devez pas accéder à la plateforme Workedin ni l&apos;utiliser.</p>
              <p><strong>1.3</strong> Notre équipe d&apos;assistance clientèle est disponible 24h/24 et 7j/7 si vous avez des questions concernant la plateforme Workedin ou les présents Termes et Conditions. Vous pouvez contacter notre équipe d&apos;assistance clientèle en soumettant une demande via notre application ou notre site Web ou en nous contactant par téléphone au numéro indiqué sur l&apos;application ou le site Web.</p>
            </div>
          </section>

          {/* 2.0 */}
          <section>
            <h2 className="text-xl font-bold mb-3">2.0 Contractual Purpose</h2>
            <div className="space-y-3">
              <p><strong>2.1</strong> Workedin provides a platform enabling Users to connect and offer services (Experts offer services) or assignments (DOs post assignments), as applicable. Furthermore, Workedin&apos;s services provide a contractual framework for Users as described in these Terms and Conditions, as well as services for User authentication, payment, chat, and storage.</p>
              <p><strong>2.2</strong> Workedin reserves the right to solicit potential Users, both IT Experts or other Experts who can enhance the service offering to DOs and &quot;Project Owner&quot; organizations that are looking for IT Experts or others in order to increase the number of business opportunities for Users.</p>
              <p><strong>2.3</strong> Workedin&apos;s services are remunerated according to the following terms (chats, logs, remote support, etc.) data and dispute resolution, where applicable. The Workedin platform also offers project management assistance and customer support.</p>
              <p><strong>2.3.1 Commission on mandates</strong> — Workedin receives a commission on each mandate completed through its platform. This commission can be calculated as follows:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Either on the professional fees charged by Experts or other Users;</li>
                <li>Either on the fixed amount agreed between the Users, as applicable. The applicable percentage or calculation method is specified when the mandate is created.</li>
              </ul>
              <p><strong>2.3.2 DO Service Fees</strong> — Workedin also charges service fees to Users identified as DOs. Details of these fees are available in the user area.</p>
              <p><strong>2.3.3 Workedin staff involvement</strong> — When Workedin staff are directly involved in the execution of a project, additional fees may be charged. These fees will be communicated to the relevant User in advance.</p>
              <p><strong>2.3.4 Advertising and Sales</strong> — Workedin may generate revenue from advertisements displayed on its platform or on any other media, as well as from product sales made through the application. In the latter case, Workedin may receive a commission on each sale.</p>
              <p><strong>2.4</strong> Workedin reserves the right at any time to expand, modify, reduce or partially discontinue its range of services for the ongoing development of its platform.</p>
              <p><strong>2.5</strong> Workedin assure à l&apos;Utilisateur la meilleure disponibilité possible du contenu et des services. Workedin a le droit d&apos;interrompre brièvement l&apos;accès à sa plateforme pour les travaux nécessaires relatifs à la maintenance, à la sécurité ou aux mises à jour nécessaires, et ce, sans préavis. Workedin n&apos;assume aucune responsabilité quant aux perturbations à la disponibilité.</p>
              <p><strong>2.6</strong> Workedin is not involved in contracts concluded directly between Expert Users and DOs. Workedin cannot be considered a contractual partner or representative. The Workedin platform is limited to facilitating connections between Experts and DOs, providing a usage policy to clarify and govern the business relationship between Users, offering project management support and documentation of interventions performed by Experts, providing access to a blog and chat room and storing the exchanges for the benefit of Experts and DOs, and offering customer service.</p>
            </div>
          </section>

          {/* 3.0 */}
          <section>
            <h2 className="text-xl font-bold mb-3">3.0 Registration and Creation of User Profile</h2>
            <div className="space-y-3">
              <p><strong>3.1</strong> Use of the Workedin platform requires registration and login as a User. Workedin is authorized to reject User requests without providing any justification.</p>
              <p><strong>3.2</strong> Users are only permitted to register and log in if they are of legal age. In the case of a legal entity, the person registering and logging in declares that they are authorized to represent the legal entity and that they are acting in full compliance with licenses, registrations and other requirements.</p>
              <p><strong>3.3</strong> When registering, the User must provide accurate personal information, using their real first and last name or, for a legal entity, the company name as it appears in the business registry of their province or country of origin. If their personal information changes, the User is obligated to update their profile. Workedin may suspend or terminate a User&apos;s account if the information provided is false, incomplete, or outdated.</p>
              <p><strong>3.4</strong> By submitting the registration form, the User proposes to enter into an agreement with Workedin. If Workedin accepts the registration, the User receives a confirmation email with a personalized activation link. From that point on, the Terms and Conditions are deemed understood and accepted by the User, who agrees to abide by them. Furthermore, the User consents to the automatic creation of a Stripe account in their name to manage identity verification and payments.</p>
              <p><strong>3.5</strong> Once registration is complete, an account is created for the User, which they can access using their email address and password. The password must be kept secret by the User and protected against access by unauthorized third parties. If the User discovers or suspects that their login credentials are being used by a third party without authorization, they must immediately notify Workedin at <a href="mailto:management@workedin.ca" className="text-primary hover:underline">management@workedin.ca</a> and change their password without delay.</p>
              <p><strong>3.6</strong> In order to ensure the security of user accounts and the protection of data, Workedin provides its users with a two-factor authentication (&quot;2FA&quot;) function. L&apos;utilisateur peut activer cette fonction à tout moment en accédant aux paramètres de sécurité de son compte. Une fois la 2FA activée, celle-ci sera exigée à chaque tentative de connexion.</p>
              <p>It is up to the user to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Keep your login credentials confidential;</li>
                <li>Retain access to the device used for two-factor authentication;</li>
                <li>Ensure that the authentication application used is functional and secure.</li>
              </ul>
              <p>In the event of a loss of access to 2FA, the user must follow the recovery procedure provided by Workedin. Workedin strongly recommends that all its users enable two-factor authentication to better secure their account.</p>
              <p>Tous les Utilisateurs qui s&apos;inscrivent à la plateforme Workedin doivent fournir une photo à jour, sans modification ou rognage. La photo doit permettre d&apos;identifier l&apos;Utilisateur, montrer son visage, être d&apos;apparence soignée. Les lunettes fumées ou autres accessoires qui pourraient cacher les yeux ou le visage ne sont pas autorisés. De plus, tous les Utilisateurs acceptent d&apos;être soumis à la procédure d&apos;authentification de Workedin via l&apos;application Stripe. Toute information fausse, inexacte ou trompeuse peut entraîner la suspension ou la suppression du compte de l&apos;Utilisateur.</p>
              <p><strong>3.7</strong> Tous les Utilisateurs additionnels qui représentent une personne morale doivent détenir leur propre compte sur la plateforme Workedin. Ils sont soumis à la même procédure décrite à l&apos;article 3.6 et doivent en outre être autorisés par le détenteur du compte principal de l&apos;organisation.</p>
              <p><strong>3.8</strong> L&apos;Utilisateur consent à ce que tout ou partie de ses informations soient publiques et puissent être partagées avec les experts ou les DO. Workedin se réserve le droit de permettre la diffusion de tout ou partie des informations personnelles inscrites dans le compte de l&apos;Utilisateur. Workedin ne peut être tenu responsable de toute information personnelle contenue dans le profil de l&apos;Utilisateur qui pourrait avoir été diffusée avant ou après l&apos;instauration de paramètres de confidentialité.</p>
              <p><strong>3.9</strong> Workedin propose deux types de comptes :</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Compte Expert</strong> – destiné aux experts en informatique (ou autres domaines) qui offrent leurs services.</li>
                <li><strong>Compte DO</strong> – destiné aux organisations ou personnes qui recherchent des services.</li>
              </ul>
              <p>Un utilisateur peut posséder les deux types de comptes, à condition de fournir toutes les informations exigées pour chaque type de compte. Workedin se réserve également le droit de créer de nouveaux types de comptes et d&apos;en déterminer les modalités d&apos;inscription et d&apos;utilisation.</p>
              <p><strong>3.10</strong> Chaque Utilisateur ne peut s&apos;inscrire qu&apos;une seule fois sur la plateforme Workedin. Les comptes d&apos;utilisateurs ne sont pas transférables. En cas d&apos;infraction, Workedin se réserve le droit de suspendre ou supprimer le compte utilisateur.</p>
              <p><strong>3.11</strong> Workedin se réserve le droit de prendre tous les moyens à sa disposition pour vérifier la validité des informations fournies par l&apos;Utilisateur, notamment par des vérifications techniques, documentaires, par croisement de données provenant de sources tierces, par vérification comportementale ou par toute autre méthode ou combinaison de méthodes.</p>
            </div>
          </section>

          {/* 4.0 */}
          <section>
            <h2 className="text-xl font-bold mb-3">4.0 Contrats de service</h2>
            <div className="space-y-3">
              <p><strong>4.1</strong> Les Utilisateurs de Workedin sont responsables de décider s&apos;ils concluent des accords avec d&apos;autres Utilisateurs et de déterminer les termes de ces accords.</p>
              <p><strong>4.2</strong> En ce qui concerne les contrats de service conclus entre des Utilisateurs via la plateforme Workedin, l&apos;Expert et le DO peuvent s&apos;entendre sur les taux exigés, les délais de réalisation des mandats (missions) et le moment des interventions, mais doivent en tout temps respecter les Termes et Conditions.</p>
              <p><strong>4.3</strong> Les utilisateurs de Workedin ne peuvent établir entre eux de relation contractuelle qui ne soit pas encadrée par les présents Termes et Conditions.</p>
              <p>En s&apos;inscrivant sur la plateforme, chaque utilisateur s&apos;engage à ne pas solliciter ni conclure de mandat ou de contrat de service directement avec un autre utilisateur, en dehors de l&apos;environnement de Workedin, et ce pendant une période de 12 mois suivant la fermeture de son compte ou l&apos;arrêt de toute utilisation de la plateforme.</p>
              <p>En cas de violation de cette obligation, l&apos;utilisateur fautif accepte de verser à Workedin une pénalité forfaitaire de <strong>7 500 $</strong>, à titre de clause pénale. Cette somme représente une estimation raisonnable des dommages que Workedin pourrait subir.</p>
              <p><strong>4.4</strong> L&apos;Expert qui contracte des mandats via la plateforme Workedin est responsable de ses propres impôts, du paiement des taxes, de la souscription de sa propre assurance et de s&apos;assurer qu&apos;il agit conformément aux lois et réglementations applicables dans sa province et/ou dans son pays. L&apos;Expert reconnaît et accepte qu&apos;il est seul responsable de toutes les obligations fiscales associées aux paiements de ses services par les DO via la plateforme Workedin.</p>
              <p><strong>4.5</strong> L&apos;Expert qui conclut un contrat avec un client via la plateforme Workedin en dehors de la province de Québec ou en dehors du Canada est tenu aux mêmes obligations et doit au surplus s&apos;assurer de notifier Workedin de toute exigence des autorités compétentes qui pourrait s&apos;appliquer à Workedin en matière fiscale, d&apos;assurance, de normes du travail ou autres.</p>
              <p><strong>4.6</strong> Dans le cas où Workedin ferait l&apos;objet d&apos;un audit, l&apos;Expert s&apos;engage à coopérer immédiatement avec Workedin et à fournir des copies de ses déclarations fiscales et d&apos;autres documents raisonnablement exigés aux fins de cet audit. Pour sa part, Workedin fournit un tableau de bord à l&apos;Utilisateur lui permettant de voir combien d&apos;heures de services il a utilisées ou facturées, selon le cas.</p>
            </div>
          </section>

          {/* 5.0 */}
          <section>
            <h2 className="text-xl font-bold mb-3">5.0 Obligations des utilisateurs</h2>
            <div className="space-y-3">
              <p className="font-semibold">5.1 Obligations générales des Utilisateurs</p>
              <p><strong>5.1.1</strong> L&apos;utilisateur doit en tout temps ne fournir que des informations exactes, vraies et non trompeuses lorsqu&apos;il communique via la plateforme Workedin, réalise un mandat ou interagit avec d&apos;autres Utilisateurs, et ne pas utiliser de pseudonymes.</p>
              <p><strong>5.1.2</strong> L&apos;utilisateur doit respecter en tout temps l&apos;usage pour lequel les champs de données ont été créés et n&apos;y saisir que des informations conformes à l&apos;usage pour lequel chaque champ de données a été créé.</p>
              <p><strong>5.1.3</strong> L&apos;Utilisateur a l&apos;obligation d&apos;envoyer uniquement des messages à d&apos;autres Utilisateurs servant à initier un service ou un mandat directement entre les Utilisateurs ou de commenter les publications du blogue de Workedin dans le respect d&apos;une communication respectueuse. Aucun langage grossier, menace, jugement de valeur ou autres termes ou expressions inappropriées ne peuvent être utilisés sur la plateforme Workedin.</p>
              <p><strong>5.1.4</strong> L&apos;Utilisateur doit traiter toutes les informations et les données reçues d&apos;autres Utilisateurs en toute confidentialité et ne pas les transmettre ou les rendre accessibles à de tierces parties. Cette obligation survivra à la résiliation du contrat ou après la terminaison du mandat.</p>
              <p><strong>5.1.5</strong> L&apos;Utilisateur doit utiliser son compte exclusivement pour lui-même ou par l&apos;intermédiaire d&apos;un représentant autorisé. Si l&apos;utilisateur craint que de tierces parties non autorisées aient acquis ses données d&apos;accès, il doit immédiatement en informer Workedin à <a href="mailto:management@workedin.ca" className="text-primary hover:underline">management@workedin.ca</a>.</p>
              <p><strong>5.1.6</strong> L&apos;utilisateur doit, dans le cas où plusieurs comptes sont créés pour ses employés, rendre chaque compte disponible à une seule personne. En cas d&apos;infractions, Workedin peut imposer une pénalité contractuelle par utilisation non autorisée d&apos;un montant de <strong>1 000 $</strong>.</p>
              <p><strong>5.1.7</strong> L&apos;Utilisateur a l&apos;obligation de s&apos;abstenir de toute action susceptible d&apos;endommager ou de nuire à la fonctionnalité de l&apos;infrastructure technique de Workedin. Workedin se réserve le droit de poursuivre afin d&apos;obtenir des dommages-intérêts ou de réclamer une pénalité monétaire de <strong>15 000 $ canadiens</strong> par action nuisible.</p>
              <p><strong>5.1.8</strong> L&apos;Utilisateur ne doit en aucun temps publier de contenu illégal sur Workedin, le logo ou des images de tierces parties sans leur consentement préalable.</p>
              <p><strong>5.1.9</strong> L&apos;Utilisateur garantit qu&apos;il est le propriétaire de tous les droits requis pour la publication en ce qui concerne le contenu qu&apos;il fournit et s&apos;abstiendra de publier du contenu qui enfreint les lois sur le droit d&apos;auteur, les marques commerciales et la concurrence.</p>
              <p><strong>5.1.10</strong> Il n&apos;est pas permis de traiter commercialement les données obtenues via la plateforme Workedin ou d&apos;approcher les Utilisateurs par de la publicité si les produits ou services offerts sont en compétition avec Workedin. En cas de violation, Workedin se réserve le droit de réclamer une pénalité monétaire forfaitaire pouvant s&apos;élever à <strong>15 000 $ canadiens</strong> par action nuisible.</p>

              <p className="font-semibold pt-2">5.2 Obligations particulières des Experts</p>
              <p><strong>5.2.1</strong> L&apos;Expert doit maintenir son profil à jour ainsi que ses informations concernant sa disponibilité. En cas d&apos;infractions, Workedin se réserve le droit de mettre hors ligne le compte de l&apos;Expert définitivement ou jusqu&apos;à ce qu&apos;il démontre sa volonté de se conformer à la présente condition, et ce, sans préavis.</p>
              <p><strong>5.2.2</strong> L&apos;Expert s&apos;engage à répondre rapidement aux demandes et messages qui lui sont transmis par les autres Utilisateurs, notamment les DO ou Workedin.</p>
              <p><strong>5.2.3</strong> L&apos;Expert s&apos;engage à être ponctuel pour les rendez-vous ou les livrables convenus avec ses clients, un autre Expert ou un représentant de Workedin.</p>
              <p><strong>5.2.4</strong> Dans le cadre de l&apos;utilisation de la plateforme, Workedin agit comme mandataire de l&apos;Expert uniquement aux fins de la facturation et du traitement des paiements. L&apos;Expert autorise expressément Workedin à émettre, en son nom et pour son compte, les factures officielles aux Donneurs d&apos;ouvrage. Les montants perçus sont remis à l&apos;Expert, déduction faite des frais de service applicables, dans un délai maximum de <strong>5 jours ouvrables</strong> suivant leur encaissement effectif par Workedin.</p>
              <p>Les factures émises incluent notamment :</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Le nom de l&apos;Expert ou de son entreprise;</li>
                <li>Le numéro d&apos;entreprise ou de taxes (le cas échéant);</li>
                <li>La description du service fourni;</li>
                <li>Le montant facturé et les taxes applicables.</li>
              </ul>
              <p>L&apos;Expert reconnaît que Workedin agit uniquement comme mandataire administratif aux fins de facturation et de traitement des paiements. Ce mandat ne crée aucune relation d&apos;emploi, de partenariat ou de solidarité entre Workedin et l&apos;Expert.</p>
              <p><strong>5.2.5</strong> L&apos;Expert est tenu de prendre tous les moyens nécessaires afin de remplir ses engagements avec diligence et professionnalisme, mais il ne peut être tenu responsable du résultat.</p>
              <p><strong>5.2.6</strong> L&apos;Expert s&apos;engage à agir de manière indépendante et éthique dans l&apos;établissement de son offre. Il est strictement interdit de communiquer entre Experts dans le but de coordonner leurs prix ou d&apos;adopter toute pratique pouvant mener à une distorsion de la concurrence.</p>
              <p><strong>5.2.7</strong> L&apos;Expert est tenu de documenter de manière rigoureuse et détaillée l&apos;ensemble de ses actions et interventions, de façon à permettre au client de suivre le travail réalisé et, le cas échéant, de faciliter la prise en charge par un autre expert sans discontinuité.</p>

              <p className="font-semibold pt-2">5.3 Obligations particulières des DO</p>
              <p><strong>5.3.1</strong> Les DO ont l&apos;obligation de publier des demandes de services qui sont réelles et pour lesquelles un mandat sera attribué. La publication d&apos;offres falsifiées ou qui ne sont plus existantes est interdite et peut entraîner un blocage temporaire ou complet du compte, et ce, sans préavis.</p>
              <p><strong>5.3.2</strong> Le DO reconnaît expressément que l&apos;Expert avec qui il a conclu un accord via la plateforme Workedin est soumis à une obligation de moyen et non à une obligation de résultat.</p>
              <p><strong>5.3.3</strong> Le DO a l&apos;obligation d&apos;accepter que les conseils, analyses ou recommandations fournis par l&apos;Expert soient donnés en fonction des informations disponibles. Le DO demeure seul responsable des décisions prises sur la base des échanges avec l&apos;Expert. En conséquence, ni Workedin, ni ses exploitants, ni les Experts ne pourront être tenus responsables en cas d&apos;écart entre les attentes du DO et les résultats obtenus.</p>
              <p><strong>5.3.4</strong> Le DO s&apos;engage à désigner, au sein de son organisation, une personne responsable de la gestion et de la sécurisation des accès, identifiants et mots de passe liés aux équipements, logiciels et applications composant son réseau. Le DO demeure seul responsable des conséquences liées à une gestion déficiente ou non sécurisée de ces accès.</p>
            </div>
          </section>

          {/* 6.0 */}
          <section>
            <h2 className="text-xl font-bold mb-3">6.0 Normes de services</h2>
            <div className="space-y-3">
              <p><strong>6.1</strong> L&apos;Expert s&apos;engage à fournir des solutions technologiques compatibles avec les infrastructures, logiciels et systèmes en place chez le DO, sauf dérogation expresse et écrite de ce dernier. Toute incompatibilité identifiée devra être signalée au DO, accompagnée de recommandations visant à assurer une intégration optimale.</p>
              <p><strong>6.2</strong> L&apos;Expert s&apos;engage à mener à bien l&apos;intégralité du mandat qui lui est confié. L&apos;Expert ne peut se retirer d&apos;un mandat sans donner à Workedin et au Donneur d&apos;ouvrage un préavis écrit d&apos;au moins <strong>quatorze (14) jours</strong> et sans assurer une transition adéquate.</p>
              <p>Tout retrait effectué sans respect du préavis et de l&apos;obligation de transition constitue un abandon injustifié. Dans un tel cas, Workedin se réserve le droit d&apos;intenter un recours judiciaire afin d&apos;obtenir réparation de l&apos;ensemble des dommages subis.</p>
              <p><strong>6.3</strong> L&apos;Expert s&apos;engage à prendre toutes les mesures nécessaires afin d&apos;assurer la sécurité, l&apos;intégrité et la confidentialité des données du DO lors de toute intervention sur son réseau. À cette fin, l&apos;Expert devra :</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Mettre en place des mesures de protection adéquates.</li>
                <li>Effectuer des sauvegardes complètes et vérifiées avant toute migration ou intervention critique.</li>
                <li>S&apos;assurer que seules les personnes autorisées ont accès aux données.</li>
                <li>Informer immédiatement le Client en cas d&apos;incident de sécurité susceptible d&apos;affecter l&apos;intégrité ou la confidentialité des données.</li>
                <li>Respecter l&apos;ensemble des lois et règlements applicables, notamment la Loi sur la protection des renseignements personnels dans le secteur privé (Québec, Loi 25) et la LPRPDE (Canada).</li>
              </ul>
            </div>
          </section>

          {/* 7.0 */}
          <section>
            <h2 className="text-xl font-bold mb-3">7.0 Achat de matériel ou de licences</h2>
            <div className="space-y-3">
              <p><strong>7.1</strong> Le DO est seul responsable de l&apos;acquisition, du financement et de la gestion de tout matériel requis pour l&apos;exécution du mandat. L&apos;Expert pourra lui fournir des recommandations quant aux équipements les plus adaptés. L&apos;Expert ne pourra être tenu responsable des conséquences découlant du choix de matériel effectué par le DO sans considération des recommandations émises.</p>
              <p><strong>7.2</strong> Le DO est responsable de l&apos;acquisition, de la validité et de la mise à jour des licences nécessaires à l&apos;utilisation des produits et solutions mises en place dans le cadre du mandat. L&apos;Expert s&apos;engage à ne pas contourner ou éviter l&apos;acquisition de licences obligatoires pour les logiciels et produits utilisés.</p>
              <p><strong>7.3</strong> L&apos;Expert s&apos;engage, pour tout mandat réalisé par l&apos;intermédiaire de la plateforme Workedin, à acquérir exclusivement l&apos;ensemble des licences logicielles dans le cadre des services rendus. Toute acquisition auprès d&apos;un tiers est interdite, sauf autorisation écrite et préalable de Workedin. En cas de manquement, Workedin se réserve le droit :</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>De facturer à l&apos;Expert la valeur des licences non acquises auprès de Workedin, majorée d&apos;une pénalité contractuelle équivalente à <strong>20 %</strong> du prix du catalogue applicable; ou</li>
                <li>De suspendre ou de résilier immédiatement le présent accord, sans préavis ni indemnité, sous réserve de tous dommages-intérêts additionnels.</li>
              </ul>
            </div>
          </section>

          {/* 8.0 */}
          <section>
            <h2 className="text-xl font-bold mb-3">8.0 Règles transactionnelles – Frais d&apos;utilisation – Commission</h2>
            <div className="space-y-3">
              <p><strong>8.1</strong> Le DO s&apos;engage à enregistrer une carte de crédit valide via l&apos;application Workedin utilisant la plateforme de paiement Stripe, dès l&apos;acceptation des présents Termes et Conditions.</p>
              <p><strong>8.2</strong> Le DO autorise expressément Workedin à prélever automatiquement sur la carte de crédit enregistrée les montants dus aux Experts pour les prestations réalisées.</p>
              <p>Pour tout projet dont la valeur totale est égale ou supérieure à <strong>10 000 $</strong> avant taxes, Workedin applique un mode de paiement échelonné :</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Un premier prélèvement représentant <strong>50 %</strong> du montant total, effectué à la mi-mandat;</li>
                <li>Un second prélèvement représentant le solde de <strong>50 %</strong>, effectué à la fin du mandat.</li>
              </ul>
              <p><strong>8.3</strong> En cas d&apos;échec du prélèvement, le DO sera notifié et devra mettre à jour ses informations de paiement dans un délai de <strong>24 heures</strong>. À défaut, Workedin pourra suspendre l&apos;accès aux services et engager toute action nécessaire au recouvrement des sommes dues.</p>
              <p><strong>8.4</strong> Les paiements sont traités via la plateforme Stripe, qui assure la sécurisation et la confidentialité des transactions conformément aux normes en vigueur. À aucun moment Workedin n&apos;a accès aux informations bancaires du DO.</p>
              <p><strong>8.5</strong> En fournissant des informations sur le mode de paiement ou en autorisant des paiements via le site ou l&apos;application, vous déclarez que : (a) vous êtes légalement autorisé à fournir ces informations ; (b) vous êtes légalement autorisé à effectuer des paiements en utilisant le(s) mode(s) de paiement ; (c) vous êtes un employé d&apos;une société, un agent d&apos;une société ou une personne autorisée par la société à utiliser le mode de paiement pour effectuer des paiements sur Workedin.</p>
              <p><strong>8.6</strong> Lorsque vous autorisez un paiement, vous déclarez qu&apos;il y a suffisamment de fonds ou de crédit disponibles pour effectuer le paiement avec la carte de crédit enregistrée.</p>
              <p><strong>8.7</strong> Workedin n&apos;est pas responsable envers un Expert si Workedin ne termine pas une transaction en raison d&apos;une limite imposée par la loi applicable ou l&apos;institution financière d&apos;un DO.</p>
              <p><strong>8.8</strong> En tant que DO, vous autorisez par la présente Workedin et Stripe, selon le cas, à exécuter des autorisations sur toutes les cartes de crédit fournies par le DO, à stocker les informations de carte de crédit et bancaires, et à facturer la carte de crédit du DO pour les honoraires dus de l&apos;Expert, les frais de service et tout autre montant exigible.</p>
              <p><strong>8.10</strong> L&apos;Expert accepte de payer à Workedin des frais de service équivalant à <strong>20 %</strong> du montant total payé par un Donneur d&apos;ouvrage pour un projet réalisé. L&apos;Expert accepte également qu&apos;un frais de plateforme de <strong>5 %</strong> soit facturé au Donneur d&apos;ouvrage.</p>
              <p>Après chaque transaction, Workedin s&apos;engage à fournir à l&apos;Expert un relevé électronique détaillant les montants reçus, les frais déduits, les taxes applicables (TPS/TVQ) ainsi que le montant net versé.</p>
              <p><strong>8.11</strong> Le DO accepte de payer à Workedin des frais de service équivalents à <strong>6 %</strong> du montant total des honoraires facturés par l&apos;Expert, à titre de frais d&apos;accès à la plateforme, de gestion administrative et de traitement des paiements. Les taxes applicables (notamment la TPS et la TVQ) s&apos;ajoutent à ces frais de service.</p>
              <p><strong>8.12</strong> En acceptant les présents Termes et Conditions, le DO reconnaît avoir pris connaissance et accepté l&apos;ensemble des modalités de paiement, incluant les frais de service, les délais et modalités de facturation, ainsi que l&apos;autorisation irrévocable de prélèvement automatique sur le moyen de paiement enregistré.</p>
            </div>
          </section>

          {/* 9.0 */}
          <section>
            <h2 className="text-xl font-bold mb-3">9.0 Protection des renseignements personnels</h2>
            <div className="space-y-3">
              <p><strong>9.1</strong> Workedin s&apos;engage à traiter tout renseignement personnel collecté dans le respect des lois applicables au Québec et au Canada, notamment la Loi sur la protection des renseignements personnels et les documents électroniques (LPRPDE) et la Loi sur la protection des renseignements personnels dans le secteur privé du Québec.</p>
              <p><strong>9.2</strong> Workedin s&apos;engage à mettre en place des mesures de sécurité adéquates pour assurer la protection des renseignements personnels contre l&apos;accès, la divulgation, la perte ou la modification non autorisée.</p>
              <p><strong>9.3</strong> Aucun renseignement personnel ne sera communiqué à des tiers sans le consentement préalable de la personne concernée, sauf si une obligation légale l&apos;exige ou l&apos;autorise.</p>
              <p><strong>9.4</strong> Les renseignements personnels seront conservés uniquement pour la durée nécessaire aux fins pour lesquelles ils ont été collectés. Une fois cette durée expirée, ils devront être détruits de manière sécurisée ou anonymisés conformément aux obligations légales applicables.</p>
              <p><strong>9.5</strong> Toute personne dont les renseignements personnels sont conservés et traités par Workedin peut exercer ses droits d&apos;accès, de rectification et de retrait du consentement conformément aux lois applicables.</p>
              <p><strong>9.6</strong> Workedin a un responsable de la protection des renseignements personnels. Pour connaître son nom, l&apos;utilisateur doit contacter le service à la clientèle de Workedin.</p>
            </div>
          </section>

          {/* 10.0 */}
          <section>
            <h2 className="text-xl font-bold mb-3">10.0 Gestion des litiges</h2>
            <div className="space-y-3">
              <p><strong>10.1</strong> En cas de différend entre les Parties (soit l&apos;Expert et le DO), celles-ci s&apos;engagent à agir de bonne foi afin de parvenir à un règlement à l&apos;amiable. La Partie insatisfaite doit notifier par écrit à l&apos;autre Partie un avis exposant la nature du différend. La partie ayant reçu l&apos;avis écrit doit y répondre dans un délai de <strong>quatorze (14) jours</strong>.</p>
              <p><strong>10.2</strong> Si aucun accord n&apos;intervient, les Parties peuvent, à leur demande conjointe, solliciter l&apos;intervention de Workedin afin qu&apos;il agisse à titre de médiateur. Cette médiation demeure facultative et ne constitue pas une obligation pour Workedin ni pour les Parties.</p>
              <p><strong>10.3</strong> Lorsqu&apos;un différend porte sur un montant supérieur à <strong>cinquante mille dollars (50 000 $)</strong>, Workedin peut exiger que le litige soit soumis à l&apos;arbitrage. La décision arbitrale sera finale, sans appel et exécutoire. Les frais liés à l&apos;arbitrage sont assumés à parts égales par les Parties.</p>
              <p><strong>10.4</strong> Toute procédure de règlement à l&apos;amiable ou d&apos;arbitrage, ainsi que les documents, communications et échanges y afférents, sont strictement confidentiels, sauf accord écrit contraire ou exigence légale.</p>
              <p><strong>10.5</strong> Les Parties renoncent expressément à intenter toute poursuite judiciaire relativement à l&apos;exécution du contrat, sauf en cas de faute lourde ou intentionnelle. En cas de poursuite impliquant directement Workedin, le différend est régi par les lois applicables dans la province de Québec, et les tribunaux du <strong>district judiciaire de Montréal</strong> auront compétence exclusive.</p>
              <p><strong>10.6</strong> Le fait pour une Partie de ne pas se prévaloir d&apos;un manquement d&apos;une autre Partie ne saurait être interprété comme une renonciation à son droit de le faire ultérieurement.</p>
              <p><strong>10.7</strong> Workedin agit uniquement comme intermédiaire entre le DO et l&apos;Expert et ne saurait être tenu responsable de l&apos;exécution des mandats ou des différends pouvant survenir entre eux, sauf en cas de faute lourde ou intentionnelle de sa part.</p>
            </div>
          </section>

          {/* 11.0 */}
          <section>
            <h2 className="text-xl font-bold mb-3">11.0 Responsabilité</h2>
            <div className="space-y-3">
              <p><strong>11.1</strong> Workedin n&apos;est pas responsable de l&apos;exactitude, de l&apos;exhaustivité, ni de la légalité des informations publiées par les Utilisateurs. Le contenu partagé par les Utilisateurs sur la plateforme ne reflète pas la position de Workedin et n&apos;est soumis à aucune vérification systématique quant à son exactitude, son exhaustivité ou sa légalité.</p>
              <p><strong>11.2</strong> Workedin ne peut être tenue responsable des dommages, quelle que soit la base juridique invoquée, sauf si ceux-ci résultent d&apos;une faute intentionnelle ou d&apos;une négligence grave de sa part ou de celle de ses représentants légaux ou mandataires.</p>
              <p><strong>11.3</strong> Workedin se dissocie expressément de tout contenu provenant de sites externes liés ou référencés sur sa plateforme. Workedin ne contrôle pas et n&apos;endosse aucun contenu illégal, inexact ou inapproprié issu de ces sites tiers.</p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-bold mb-3">Contact</h2>
            <div className="space-y-1">
              <p>Email: <a href="mailto:management@workedin.ca" className="text-primary hover:underline">management@workedin.ca</a></p>
              <p>Address: 1012, des Grives, Victoriaville Qc, G6T 1E8</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
